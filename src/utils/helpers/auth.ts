import * as jose from 'jose';
import { RegisterInformation, ValidationErrors } from '@/models/types/Auth';
import ResponseError from '@/models/classes/responseError';
import { ValidationMessages } from '@/models/enums/errorMessages';
import { NextRequest } from 'next/server';
import { UpdateProfileInformation } from '@/models/types/Auth';
import { TokenPayload } from '@/models/types/Auth';

import { LoginInformation } from '@/models/types/Auth';
import PrismaKit from '@/models/classes/prisma';
const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
export const generateToken = async (
  payload: jose.JWTPayload
): Promise<string> => {
  const secret = new TextEncoder().encode(SECRET_KEY);
  console.log('Encoded Secret:', secret);

  const token = await new jose.SignJWT({
    id: payload.id,
    username: payload.username,
    email: payload.email,
    admin: payload.admin,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('20s')
    .sign(secret);

  return token;
};

export const generateRefreshToken = async (
  payload: jose.JWTPayload
): Promise<string> => {
  const refreshSecret = new TextEncoder().encode(REFRESH_SECRET_KEY);

  const token = await new jose.SignJWT({
    id: payload.id,
    username: payload.username,
    email: payload.email,
    admin: payload.admin,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(refreshSecret);

  return token;
};

export const verifyToken = async (
  req: NextRequest
): Promise<TokenPayload | null> => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  console.log('TOKEN: ', token);

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(SECRET_KEY);

    const { payload }: { payload: TokenPayload } = await jose.jwtVerify(
      token,
      secret,
      {
        algorithms: ['HS256'],
      }
    );

    if (typeof payload !== 'object' || !payload.id) {
      return null;
    }

    return payload;
  } catch (err) {
    if (err instanceof jose.errors.JWTExpired) {
      console.log('Token has expired:', err);
    } else {
      console.log('JWT verification error:', err);
    }
    return null;
  }
};
export const verifyAdminAccess = async (req: NextRequest): Promise<boolean> => {
  const isAdmin = req.headers.get('admin-access');
  return isAdmin === 'true';
};
export const verifyRefreshToken = async (
  token: string
): Promise<jose.JWTPayload | null> => {
  try {
    const secret = new TextEncoder().encode(REFRESH_SECRET_KEY);

    const { payload } = await jose.jwtVerify(token, secret);

    if (typeof payload !== 'object') {
      return null;
    }

    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const verifyRegisterInformation = async (
  body: RegisterInformation
): Promise<[boolean, Response]> => {
  const errors: ValidationErrors = {};

  if (!body.username) {
    errors.username = ValidationMessages.USERNAME_REQUIRED;
  } else if (body.username.length < 4) {
    errors.username = ValidationMessages.USERNAME_TOO_SHORT;
  }

  if (!body.lastName) {
    errors.lastName = ValidationMessages.LAST_NAME_REQUIRED;
  }

  if (!body.firstName) {
    errors.firstName = ValidationMessages.FIRST_NAME_REQUIRED;
  }

  if (!body.password) {
    errors.password = ValidationMessages.PASSWORD_REQUIRED;
  }

  if (!body.email) {
    errors.email = ValidationMessages.EMAIL_REQUIRED;
  }

  if (body.username) {
    try {
      const usernameAvailable = await PrismaKit.user.checkUsernameAvailability(
        body.username
      );
      if (!usernameAvailable) {
        errors.username = ValidationMessages.INVALID_USERNAME_NOT_AVAILABLE;
      }
    } catch {
      return [true, ResponseError.default.internalServerError()];
    }
  }

  if (body.email) {
    try {
      const emailAvailable = await PrismaKit.user.checkEmailAvailability(
        body.email
      );
      if (!emailAvailable) {
        errors.email = ValidationMessages.INVALID_EMAIL_NOT_AVAILABLE;
      }
    } catch {
      return [true, ResponseError.default.internalServerError()];
    }
  }

  return [
    Object.keys(errors).length > 0,
    ResponseError.custom.badRequest_validationError(errors),
  ];
};
export const validateApiKey = (req: NextRequest) => {
  const validApiKey = process.env.API_KEY || '';
  const apiKey = req.headers.get('x-api-key');
  console.log('API KEY: ', apiKey);
  console.log('VALID API KEY: ', validApiKey);
  if (!apiKey || apiKey !== validApiKey || validApiKey === '') {
    console.log('ooops');
    return false;
  }
  return true;
};
export const validateLoginBody = (
  body: LoginInformation
): [boolean, Response] => {
  const errors: ValidationErrors = {};

  if (body.email === '' || body.password === '') {
    errors.password_or_email = ValidationMessages.INVALID_PASSWORD_OR_EMAIL;
  }
  if (body.username === '' || body.password === '') {
    errors.password_or_username =
      ValidationMessages.INVALID_PASSWORD_OR_USERNAME;
  }
  return [
    Object.keys(errors).length > 0,
    ResponseError.custom.badRequest_validationError(errors),
  ];
};
export const validateUpdateProfileBody = async (
  body: UpdateProfileInformation
): Promise<[boolean, Response]> => {
  const errors: ValidationErrors = {};
  if (!body.existing_password || !body.existing_username) {
    return [true, ResponseError.custom.badRequest('Missing required fields')];
  }
  if (!body.existing_username.trim()) {
    errors.existing_username = ValidationMessages.USERNAME_REQUIRED;
  }
  if (!body.existing_password.trim()) {
    errors.existing_password = ValidationMessages.PASSWORD_REQUIRED;
  }
  try {
    if (body.username) {
      const available = await PrismaKit.user.checkUsernameAvailability(
        body.username
      );
      if (!available) {
        errors.username = ValidationMessages.INVALID_USERNAME_NOT_AVAILABLE;
      }
    }
  } catch (err) {
    return [
      true,
      ResponseError.custom.internalServerError((err as Error).message),
    ];
  }
  try {
    if (body.email) {
      const available = await PrismaKit.user.checkEmailAvailability(body.email);
      if (!available) {
        errors.email = ValidationMessages.INVALID_EMAIL_NOT_AVAILABLE;
      }
    }
  } catch (err) {
    return [
      true,
      ResponseError.custom.internalServerError((err as Error).message),
    ];
  }

  return [
    Object.keys(errors).length > 0,
    ResponseError.custom.badRequest_validationError(errors),
  ];
};

export const extractUserAuthData = (
  req: NextRequest
): { userId: string; isAdmin: boolean } => {
  console.log('Cookies: ' + req.cookies);
  // const userId = req.cookies.get('userId')?.value as string;
  // const isAdmin = req.cookies.get('admin')?.value === 'true';
  const userId = req.headers.get('x-user-id') as string;
  const isAdmin = req.headers.get('x-admin') === 'true';
  return {
    userId: userId,
    isAdmin,
  };
};
