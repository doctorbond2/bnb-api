import { User as PrismaUser } from '@prisma/client';
import {
  LoginInformation,
  RegisterInformation,
  UpdateProfileInformation,
} from './Auth';

export interface User extends PrismaUser {
  fullName?: string;
}
export interface UserFrontend
  extends Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'id'> {
  fullName?: string;
}

export interface UserContextInterface {
  login: (formData: LoginInformation) => Promise<void>;
  register: (formData: RegisterInformation) => Promise<void>;
  update: (formData: UpdateProfileInformation) => Promise<void>;
  logout: () => Promise<void>;
  user: UserFrontend | null;
  setUser: Dispatch<SetStateAction<UserFrontend | null>>;
}
