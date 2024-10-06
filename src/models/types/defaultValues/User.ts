import { UserContextInterface } from '../User';
import {
  LoginInformation,
  RegisterInformation,
  UpdateProfileInformation,
} from '../Auth';
export const defaultUserContextInterface: UserContextInterface = {
  login: async (formData: LoginInformation): Promise<void> => {
    if (formData) {
      console.log('Default');
    }
  },
  register: async (formData: RegisterInformation): Promise<void> => {
    if (formData) {
      console.log('Default');
    }
  },
  update: async (formData: UpdateProfileInformation): Promise<void> => {
    if (formData) {
      console.log('Default');
    }
  },
  logout: async (): Promise<void> => {
    console.log('Default');
  },
  user: null,
  setUser: () => {},
};
