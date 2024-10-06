import { AuthRoles } from '../enums/auth';
import { ValidationMessages } from '../enums/errorMessages';
type Token = string;
type RefreshToken = string;

export interface Auth {
  token?: Token;
  refreshToken?: RefreshToken;
}
export interface RegisterInformation {
  username: string;
  lastName: string;
  firstName: string;
  password: string;
  email: string;
  admin?: boolean;
}
export type AxiosUser = AuthRoles;

export interface User_JWT {
  username: string;
  email: string;
  admin?: boolean;
}
export interface LoginInformation {
  username?: string;
  email?: string;
  password: string;
}
export interface UpdateProfileInformation {
  existing_username: string;
  existing_password: string;
  username?: string;
  lastName?: string;
  firstName?: string;
  password?: string;
  email?: string;
}
export interface ValidationErrors extends ValidationMessages {
  token?: string;
  refreshToken?: string;
  username?: string;
  lastName?: string;
  firstName?: string;
  password?: string;
  existing_password?: string;
  existing_username?: string;
  email?: string;
  email_or_username?: string;
  password_or_username?: string;
  password_or_email?: string;
  admin?: string;
  key?: string;
  body?: string;
}
export interface Token {
  username: string;
  email: string;
  admin: boolean;
}
