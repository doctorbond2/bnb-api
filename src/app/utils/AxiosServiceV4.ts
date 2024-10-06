import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosUser } from '@/models/types/Auth';
import { AuthRoles } from '@/models/enums/auth';
import COOKIES from '@/models/classes/Cookies';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
class AxiosService<T extends AxiosUser> {
  private IS_PROD = process.env.NODE_ENV === 'production';
  private IS_DEV = process.env.NODE_ENV === 'development';

  private BaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api';
  private api: AxiosInstance;
  private headers: {
    'Content-Type': string;
    'admin-access': boolean;
    Authorization?: string;
    'x-api-key'?: string;
  } = {
    'Content-Type': 'application/json',
    'admin-access': false,
  };

  constructor(role: T) {
    this.api = axios.create({
      baseURL: this.BaseUrl,
      headers: this.headers,
    });

    this.setAdminAccess(role === AuthRoles.ADMIN);
    this.setApiKey(role === AuthRoles.ADMIN || role === AuthRoles.USER);

    this.checkForTokens();
    if (role === AuthRoles.ADMIN || role === AuthRoles.USER) {
      this.api.interceptors.response.use(
        (response) => response,
        this.errorInterceptorRefreshToken
      );
    }
    this.api.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
      if (this.headers.Authorization) {
        config.headers.Authorization = this.headers.Authorization;
      }
      return config;
    });
  }

  private setAdminAccess(isAdmin: boolean): void {
    this.headers['admin-access'] = isAdmin;
    this.api.defaults.headers['admin-access'] = isAdmin;
  }
  private setApiKey(isValid: boolean): void {
    if (!isValid) {
      return;
    }
    this.headers['x-api-key'] = process.env.API_KEY;
  }
  private addTokenToHeaders(token: string): void {
    this.headers.Authorization = `Bearer ${token}`;
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }
  private checkForTokens(): void {
    const token: string | null = COOKIES.getToken();
    if (token && token !== 'undefined' && token !== 'null' && token !== '') {
      console.log('token found');
      this.addTokenToHeaders(token);
    }
  }
  private errorInterceptorRefreshToken = async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = COOKIES.getRefreshToken();

      if (refreshToken) {
        try {
          const newTokens = await this.fetchNewTokens(refreshToken);

          if (newTokens) {
            this.addTokenToHeaders(newTokens.token);
            originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
            COOKIES.setToken(newTokens.token);
            COOKIES.setRefreshToken(newTokens.refreshToken);
            return this.api(originalRequest);
          }
        } catch (err) {
          console.log('Error fetching new tokens:', err);
        }
      }
    }
    COOKIES.clearToken();
    COOKIES.clearRefreshToken();
    delete this.headers.Authorization;
    return Promise.reject(error);
  };

  private fetchNewTokens = async (
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string } | null> => {
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await this.api.post('/auth/refreshToken', refreshToken);
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  public get = async (url: string) => {
    return this.api.get(url);
  };
  public post = async <T>(url: string, data: T) => {
    return this.api.post(url, data);
  };
  public put = async <T>(url: string, data: T) => {
    return this.api.put(url, data);
  };
  public delete = async (url: string) => {
    return this.api.delete(url);
  };
}
const GuestService = new AxiosService(AuthRoles.GUEST);
const UserService = new AxiosService(AuthRoles.USER);
const AdminService = new AxiosService(AuthRoles.ADMIN);

export { GuestService, UserService, AdminService };
export default AxiosService;
