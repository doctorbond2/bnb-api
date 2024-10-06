import { NextRequest } from 'next/server';
import { verifyToken } from '../helpers/auth';
import { validateApiKey } from '../helpers/auth';
import { ValidationErrors } from '@/models/types/Auth';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
// export const middleware_authenticate_request = async (request: NextRequest) => {
//   const errors = [];
//   const tokenOK = await verifyToken(request);
//   const keyOK = validateApiKey(request);
//   if (!tokenOK) {
//     errors.push('Invalid token');
//   }
//   if (!keyOK) {
//     errors.push('Invalid key');
//   }
//   return {
//     hasErrors: errors.length > 0,
//     errors,
//   };
// };
export const middleware_authenticate_request = async (
  request: NextRequest
): Promise<[boolean, ValidationErrors, string | null]> => {
  const errors: ValidationErrors = {};
  const userId = await verifyToken(request);
  console.log('tokenId', userId);
  const key = validateApiKey(request);
  if (!userId) {
    errors.token = M.INVALID_TOKEN;
  }
  if (!key) {
    errors.key = M.INVALID_KEY;
  }
  return [Object.keys(errors).length > 0, errors, userId];
};
export const middleware_admin_request = async (
  request: NextRequest
): Promise<[boolean, ValidationErrors]> => {
  const errors: ValidationErrors = {};
  const tokenOK = await verifyToken(request);
  const keyOK = validateApiKey(request);
  if (!tokenOK) {
    errors.token = M.INVALID_TOKEN;
  }
  if (!keyOK) {
    errors.key = M.INVALID_KEY;
  }
  return [Object.keys(errors).length > 0, errors];
};
