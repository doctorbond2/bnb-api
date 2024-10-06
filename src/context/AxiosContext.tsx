// // contexts/AxiosContext.tsx

// import React, { createContext, useContext, useEffect } from 'react';
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

// interface AxiosContextType {
//   api: AxiosInstance;
//   fetchNewTokens: () => Promise<{ token: string; refreshToken: string } | null>;
//   addTokenToHeaders: (token: string) => void;
// }

// const AxiosContext = createContext<AxiosContextType | undefined>(undefined);

// const AxiosProvider: React.FC<{
//   role: AxiosUser;
//   children: React.ReactNode;
// }> = ({ role, children }) => {
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
//       const newTokens = await fetchNewTokens();
//       if (newTokens) {
//         addTokenToHeaders(newTokens.token);
//         originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
//         COOKIES.setToken(newTokens.token);
//         COOKIES.setRefreshToken(newTokens.refreshToken);
//         return api(originalRequest);
//       }
//     }

//     COOKIES.clearToken();
//     COOKIES.clearRefreshToken();
//     delete api.defaults.headers.Authorization;
//     return Promise.reject(error);
//   };
//   let interceptorId: number = 0;
//   useEffect(() => {
//     if (role !== AuthRoles.GUEST) {
//       api.interceptors.response.use(
//         (response) => response,
//         errorInterceptorRefreshToken
//       );
//     }
//     checkForTokens();
//     return () => {
//       api.interceptors.response.eject(interceptorId);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [role]);

//   return (
//     <AxiosContext.Provider value={{ api, fetchNewTokens, addTokenToHeaders }}>
//       {children}
//     </AxiosContext.Provider>
//   );
// };

// const useAxios = (): AxiosContextType => {
//   const context = useContext(AxiosContext);
//   if (!context) {
//     throw new Error('useAxios must be used within an AxiosProvider');
//   }
//   return context;
// };

// export { AxiosProvider, useAxios };
