import { UpdateProfileInformation } from '@/models/types/Auth';
import { DB_Updated_User } from '@/models/types/Database';
export const filterUpdateDetails = (
  obj: UpdateProfileInformation
): DB_Updated_User => {
  const { existing_password, existing_username, ...updateData } = obj;
  return updateData;
};
