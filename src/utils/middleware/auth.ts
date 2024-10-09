import { NextRequest } from 'next/server';
import { verifyToken } from '../helpers/auth';
import { validateApiKey } from '../helpers/auth';
import { TokenPayload, ValidationErrors } from '@/models/types/Auth';
import { ValidationMessages as M } from '@/models/enums/errorMessages';

export const middleware_authenticate_request = async (
  request: NextRequest
): Promise<[boolean, ValidationErrors, TokenPayload | null]> => {
  const errors: ValidationErrors = {};
  const user = await verifyToken(request);

  const key = validateApiKey(request);

  //KOM IHÅG du la till user ID check här
  if (!user || !user.id) {
    errors.token = M.INVALID_TOKEN;
  }
  if (!key) {
    errors.key = M.INVALID_KEY;
  }
  return [Object.keys(errors).length > 0, errors, user];
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
