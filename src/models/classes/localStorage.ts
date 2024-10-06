class LOCAL_STORAGE {
  constructor() {}
  private static STORAGE_TOKEN_KEY =
    process.env.NEXT_PUBLIC_STORAGE_TOKEN_KEY || 'token';
  private static STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';

  static token = {
    set: (token: string) => {
      localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
    },
    get: () => {
      return localStorage.getItem(this.STORAGE_TOKEN_KEY);
    },
    remove: () => {
      localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    },
  };
  static refreshToken = {
    set: (token: string) => {
      localStorage.setItem(this.STORAGE_REFRESH_TOKEN_KEY, token);
    },
    get: () => {
      return localStorage.getItem(this.STORAGE_REFRESH_TOKEN_KEY);
    },
    remove: () => {
      localStorage.removeItem(this.STORAGE_REFRESH_TOKEN_KEY);
    },
  };
}
export default LOCAL_STORAGE;
