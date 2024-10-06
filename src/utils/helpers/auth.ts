import * as jose from 'jose';
import { RegisterInformation, ValidationErrors } from '@/models/types/Auth';
import ResponseError from '@/models/classes/responseError';
import { ValidationMessages } from '@/models/enums/errorMessages';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfileInformation } from '@/models/types/Auth';

import { LoginInformation } from '@/models/types/Auth';
import PrismaKit from '@/models/classes/prisma';
const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
export const generateToken = async (
  payload: jose.JWTPayload
): Promise<string> => {
  const secret = new TextEncoder().encode(SECRET_KEY);

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return token;
};

export const generateRefreshToken = async (
  payload: jose.JWTPayload
): Promise<string> => {
  const refreshSecret = new TextEncoder().encode(REFRESH_SECRET_KEY);

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(refreshSecret);

  return token;
};

export const verifyToken = async (req: NextRequest): Promise<string | null> => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  console.log('TOKEN: ', token);

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(SECRET_KEY);

    const { payload } = await jose.jwtVerify(token, secret);

    if (typeof payload !== 'object' || !payload.id) {
      return null;
    }

    return payload.id as string;
  } catch (err) {
    console.log(err);
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
export const veryifyRegisterInformation = async ({
  username,
  lastName,
  firstName,
  password,
  email,
}: RegisterInformation): Promise<string[]> => {
  const {
    USERNAME_REQUIRED,
    USERNAME_TOO_SHORT,
    LAST_NAME_REQUIRED,
    FIRST_NAME_REQUIRED,
    PASSWORD_REQUIRED,
    EMAIL_REQUIRED,
    INVALID_USERNAME_NOT_AVAILABLE,
    INVALID_EMAIL_NOT_AVAILABLE,
  } = ValidationMessages;
  const errors: string[] = [];
  if (!username) {
    errors.push(USERNAME_REQUIRED);
  } else if (username.length < 4) {
    errors.push(USERNAME_TOO_SHORT);
  }
  if (!lastName) {
    errors.push(LAST_NAME_REQUIRED);
  }
  if (!firstName) {
    errors.push(FIRST_NAME_REQUIRED);
  }
  if (!password) {
    errors.push(PASSWORD_REQUIRED);
  }
  if (!email) {
    errors.push(EMAIL_REQUIRED);
  }
  const usernameAvailable = await PrismaKit.checkUsernameAvailability(username);
  if (!usernameAvailable) {
    errors.push(INVALID_USERNAME_NOT_AVAILABLE);
  }
  const emailAvailable = await PrismaKit.checkEmailAvailability(email);
  if (!emailAvailable) {
    errors.push(INVALID_EMAIL_NOT_AVAILABLE);
  }
  return errors;
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
export const validateLoginBody = (body: LoginInformation) => {
  const errors: ValidationErrors = {};

  if (body.email === '' || body.password === '') {
    errors.password_or_email = ValidationMessages.INVALID_PASSWORD_OR_EMAIL;
  }
  if (body.username === '' || body.password === '') {
    errors.password_or_username =
      ValidationMessages.INVALID_PASSWORD_OR_USERNAME;
  }
  return [Object.keys(errors).length > 0, errors];
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
      const available = PrismaKit.checkUsernameAvailability(body.username);
      if (!available) {
        errors.username = ValidationMessages.INVALID_USERNAME_NOT_AVAILABLE;
      }
    }

    if (body.email) {
      const available = PrismaKit.checkEmailAvailability(body.email);
      if (!available) {
        errors.email = ValidationMessages.INVALID_EMAIL_NOT_AVAILABLE;
      }
    }
  } catch {
    return [true, ResponseError.default.internalServerError()];
  }
  return [
    Object.keys(errors).length > 0,
    NextResponse.json({ errors }, { status: 400 }),
  ];
};
