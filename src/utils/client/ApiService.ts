// import axios, {
//   AxiosInstance,
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from 'axios';
// import { AxiosUser } from '@/models/types/Auth';
// import { AuthRoles } from '@/models/enums/auth';
// import COOKIES from '@/models/classes/Cookies';

// interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// // Define global axios instances using globalThis
// interface GlobalThisWithAxiosInstances extends GlobalThis {
//   axiosInstances?: Record<AxiosUser, AxiosInstance | undefined>;
// }

// const globalWithAxiosInstances = globalThis as GlobalThisWithAxiosInstances;

// const axiosInstances: Record<AxiosUser, AxiosInstance | undefined> =
//   globalWithAxiosInstances.axiosInstances ||
//   (globalWithAxiosInstances.axiosInstances = {
//     [AuthRoles.ADMIN]: undefined,
//     [AuthRoles.USER]: undefined,
//     [AuthRoles.GUEST]: undefined,
//   });

// const createAxiosService = (role: AxiosUser) => {
//   // Check if the instance already exists for the given role
//   if (axiosInstances[role]) {
//     console.log(`Using existing axios service for role: ${role}`);
//     return axiosInstances[role];
//   }

//   console.log('Creating new axios service instance');
//   const BaseUrl =
//     process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api';
//   const api: AxiosInstance = axios.create({
//     baseURL: BaseUrl,
//     headers: {
//       'Content-Type': 'application/json',
//       'admin-access': role === AuthRoles.ADMIN,
//     },
//   });

//   const addTokenToHeaders = (token: string) => {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   };

//   const checkForTokens = () => {
//     const token = COOKIES.getToken();
//     if (token) {
//       addTokenToHeaders(token);
//     }
//   };

//   const fetchNewTokens = async () => {
//     const refreshToken = COOKIES.getRefreshToken();
//     if (!refreshToken) return null;
//     try {
//       const response = await api.post('/auth/refreshToken', {
//         token: refreshToken,
//       });
//       if (response.status === 200) {
//         return response.data;
//       }
//     } catch (error) {
//       console.error('Error fetching new tokens:', error);
//     }
//     return null;
//   };

//   const errorInterceptorRefreshToken = async (error: AxiosError) => {
//     const originalRequest = error.config as ExtendedAxiosRequestConfig;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = COOKIES.getRefreshToken();

//       if (refreshToken) {
//         const newTokens = await fetchNewTokens();
//         if (newTokens) {
//           addTokenToHeaders(newTokens.token);
//           originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
//           COOKIES.setToken(newTokens.token);
//           COOKIES.setRefreshToken(newTokens.refreshToken);
//           return api(originalRequest);
//         }
//       }
//     }

//     COOKIES.clearToken();
//     COOKIES.clearRefreshToken();
//     delete api.defaults.headers.Authorization;
//     return Promise.reject(error);
//   };

//   if (role !== AuthRoles.GUEST) {
//     api.interceptors.response.use(
//       (response) => response,
//       errorInterceptorRefreshToken
//     );
//   }

//   // Store the created instance in the axiosInstances object
//   axiosInstances[role] = api;

//   return {
//     api,
//     fetchNewTokens,
//     addTokenToHeaders,
//     get: (url: string) => api.get(url),
//     post: <T>(url: string, data: T) => api.post(url, data),
//     put: <T>(url: string, data: T) => api.put(url, data),
//     delete: (url: string) => api.delete(url),
//     checkForTokens,
//   };
// };

// // Use the singleton instances for each role
// const adminService = createAxiosService(AuthRoles.ADMIN);
// const userService = createAxiosService(AuthRoles.USER);
// const guestService = createAxiosService(AuthRoles.GUEST);

// export { adminService, userService, guestService };
