import Cookies from 'js-cookie';

class COOKIES {
  constructor() {}

  static setToken(token: string) {
    Cookies.set('token', token, { expires: 7 });
  }

  static setRefreshToken(refreshToken: string) {
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
  }

  static getToken(): string | null {
    return Cookies.get('token') || null;
  }

  static getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  static clearToken() {
    Cookies.remove('token');
  }

  static clearRefreshToken() {
    Cookies.remove('refreshToken');
  }
}

export default COOKIES;
