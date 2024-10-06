// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-var */
// import axios, {
//   AxiosInstance,
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from 'axios';
// import { AxiosUser } from '../types/Auth';
// import { AuthRoles } from '../enums/auth';
// import COOKIES from './Cookies';

// interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }
// class AxiosService<T extends AxiosUser> {
//   private IS_PROD = process.env.NODE_ENV === 'production';
//   private IS_DEV = process.env.NODE_ENV === 'development';

//   private BaseUrl =
//     process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api';
//   private api: AxiosInstance;
//   private headers: {
//     'Content-Type': string;
//     'admin-access': boolean;
//     Authorization?: string;
//     'x-api-key'?: string;
//   } = {
//     'Content-Type': 'application/json',
//     'admin-access': false,
//   };
//   guest = axios.create({
//     baseURL: this.BaseUrl,
//     headers: this.headers,
//   });
//   user = axios.create({
//     baseURL: this.BaseUrl,
//     headers: { ...this.headers, 'x-api-key': process.env.API_KEY },
//   });

//   admin = axios.create({
//     baseURL: this.BaseUrl,
//     headers: {
//       ...this.headers,
//       'x-api-key': process.env.API_KEY,
//       'admin-access': true,
//     },
//   });
//   constructor(role: T) {
//     this.api = axios.create({
//       baseURL: this.BaseUrl,
//       headers: this.headers,
//     });

//     this.checkForTokens();
//     if (role === AuthRoles.ADMIN || role === AuthRoles.USER) {
//       this.api.interceptors.response.use(
//         (response) => response,
//         this.errorInterceptorRefreshToken
//       );
//     }
//     this.api.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
//       if (this.headers.Authorization) {
//         config.headers.Authorization = this.headers.Authorization;
//       }
//       return config;
//     });
//   }

//   addTokenToHeaders(token: string): void {
//     this.headers.Authorization = `Bearer ${token}`;
//     this.api.defaults.headers.Authorization = `Bearer ${token}`;
//   }
//   deleteTokenFromHeaders(): void {
//     delete this.headers.Authorization;
//     delete this.api.defaults.headers.Authorization;
//   }
//   checkForTokens(): void {
//     const token: string | null = COOKIES.getToken();
//     if (token && token !== 'undefined' && token !== 'null' && token !== '') {
//       this.addTokenToHeaders(token);
//     }
//   }

//   fetchNewTokens = async (
//     refreshToken: string
//   ): Promise<{ token: string; refreshToken: string } | null> => {
//     if (!refreshToken) {
//       return null;
//     }
//     try {
//       const response = await this.api.post('/auth/refreshToken', refreshToken);
//       if (response.status !== 200) {
//         return null;
//       }
//       return response.data;
//     } catch (err) {
//       console.log(err);
//       return null;
//     }
//   };
//   public get = async (url: string) => {
//     return this.api.get(url);
//   };
//   public post = async <T>(url: string, data: T) => {
//     return this.api.post(url, data);
//   };
//   public put = async <T>(url: string, data: T) => {
//     return this.api.put(url, data);
//   };
//   public delete = async (url: string) => {
//     return this.api.delete(url);
//   };
// }
// const ApiService = new AxiosService();

// export default ApiService;
