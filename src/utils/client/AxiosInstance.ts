// import ApiService from '@/models/classes/AxiosServiceV2';
// import { AuthRoles } from '@/models/enums/auth';
// import { InternalAxiosRequestConfig } from 'axios';
// import { AxiosError } from 'axios';
// import COOKIES from '@/models/classes/Cookies';
// import { get } from 'http';
// interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }
// const admin_service = {
//   api: ApiService.admin,
//     async fetchNewTokens(refreshToken: string) {
//         if (!refreshToken) {
//         return null;
//         }
//         try {
//         const response = await this.api.post('/auth/refreshToken', refreshToken);
//         if (response.status !== 200) {
//             return null;
//         }
//         return response.data;
//         } catch (err) {
//         console.log(err);
//         return null;
//         }
//     }
// };
// const user_service = {
//   api: ApiService.user,
//     async fetchNewTokens(refreshToken: string) {
//         if (!refreshToken) {
//         return null;
//         }
//         try {
//         const response = await this.api.post('/auth/refreshToken', refreshToken);
//         if (response.status !== 200) {
//             return null;
//         }
//         return response.data;
//         } catch (err) {
//         console.log(err);
//         return null;
//         }
//     }
// };
// const guest_service = {
//   api: ApiService.guest,
//   async fetchNewTokens(refreshToken: string) {
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
//   }
// };
// exportconst addTokenToHeaders = (token: string) => {
//   user_service.api.defaults.headers.Authorization = `Bearer ${token}`;
//   admin_service.api.defaults.headers.Authorization = `Bearer ${token}`;
// };
// async function errorInterceptorRefreshToken(error: AxiosError) {
//   const originalRequest = error.config as ExtendedAxiosRequestConfig;

//   if (error.response?.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;
//     const refreshToken = COOKIES.getRefreshToken();

//     if (refreshToken) {
//       try {
//         const newTokens = await guest_service.api.fetchNewTokens(refreshToken);

//         if (newTokens) {
//           addTokenToHeaders(newTokens.token);
//           originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
//           COOKIES.setToken(newTokens.token);
//           COOKIES.setRefreshToken(newTokens.refreshToken);
//           return this.api(originalRequest);
//         }
//       } catch (err) {
//         console.log('Error fetching new tokens:', err);
//       }
//     }
//   }
//   COOKIES.clearToken();
//   COOKIES.clearRefreshToken();
//   delete this.headers.Authorization;
//   return Promise.reject(error);
// }
// const fetchNewTokens = async (
//   refreshToken: string
// ): Promise<{ token: string; refreshToken: string } | null> => {
//   if (!refreshToken) {
//     return null;
//   }
//   try {
//     const response = await this.api.post('/auth/refreshToken', refreshToken);
//     if (response.status !== 200) {
//       return null;
//     }
//     return response.data;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };
// const updateTokens = <T>(service: T, token: string) => {};
// admin_service.api.interceptors.response.use(
//   (response) => response,
//   errorInterceptorRefreshToken
// );
// user_service.api.interceptors.response.use(
//   (response) => response,
//   errorInterceptorRefreshToken
// );
