import bcrypt from 'bcrypt';
import { GeneralStrings as G } from '@/models/enums/general';
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
export const comparePassword = async (password: string, hash: string) => {
  const test = await bcrypt.compare(password, hash);
  console.log('TEST: ', test);
  return await bcrypt.compare(password, hash);
};
export const generateConfirmationCode = (): string => {
  const codeCharacters = G.codeCharacters;
  const codeLength = 8;
  let code: string = '';
  for (let i = 0; i < codeLength; i++) {
    code += codeCharacters.charAt(
      Math.floor(Math.random() * codeCharacters.length)
    );
  }
  return code;
};
