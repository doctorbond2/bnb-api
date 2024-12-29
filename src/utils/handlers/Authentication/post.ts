import prisma from '@/lib/prisma';
import ResponseError from '@/models/classes/responseError';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
// import { cookies } from 'next/headers';
import { RegisterInformation } from '@/models/types/Auth';
import { UserFrontend } from '@/models/types/User';
import { hashPassword, comparePassword } from '@/utils/helpers/password';
import { validateLoginBody } from '@/utils/helpers/auth';
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
  verifyRegisterInformation,
} from '@/utils/helpers/auth';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import PrismaKit from '@/models/classes/prisma';
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 7);
export const LoginUser = async (req: NextRequest): Promise<Response> => {
  const body: User = await req.json();
  const [hasErrors, errors] = validateLoginBody(body);
  if (hasErrors) {
    return errors;
  }
  const search = {
    key: body.username ? 'username' : 'email',
    value: body.username
      ? body.username.toLowerCase()
      : body.email.toLowerCase(),
  };
  try {
    const user: User | null = await prisma.user.findUnique({
      where:
        search.key === 'username'
          ? { username: search.value }
          : { email: search.value },
    });
    if (!user) {
      return ResponseError.custom.notFound(M.USER_NOT_FOUND);
    }
    const isValidPassword = await comparePassword(body.password, user.password);
    if (!isValidPassword) {
      return ResponseError.custom.unauthorized(M.INVALID_PASSWORD_OR_USERNAME);
    }
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);
    const userFrontend: UserFrontend = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin ? true : false,
    };
    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 15);

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 1);

    const auth = {
      token,
      refreshToken,
      xApiKey: process.env.API_KEY || 'API_KEY',
      admin: user.admin ? true : false,
    };
    const response = NextResponse.json(
      {
        user: userFrontend,
        message: 'You are logged in.',
        tokenExpiry,
        refreshTokenExpiry,
        auth,
      },
      { status: 200 }
    );

    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
export const registerUser = async (req: NextRequest): Promise<Response> => {
  const body: RegisterInformation = await req.json();
  if (!body) {
    return ResponseError.default.badRequest();
  }
  const [hasErrors, errors] = await verifyRegisterInformation(body);
  if (hasErrors) {
    return errors;
  }
  const hashedPassword = await hashPassword(body.password);
  try {
    await PrismaKit.user.create(body, hashedPassword);

    return NextResponse.json({
      status: 201,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return ResponseError.custom.internalServerError(err.message);
    } else {
      console.log(String(err));
      return ResponseError.custom.internalServerError(String(err));
    }
  }
};
export const refreshTokens = async (req: NextRequest): Promise<Response> => {
  // let refreshToken = req.cookies.get('refreshToken')?.value;
  const refreshToken = req.headers.get('refreshToken') || null;
  // if (!refreshToken) {
  //   refreshToken = cookies().get('refreshToken')?.value;
  // }
  if (!refreshToken) {
    return ResponseError.custom.unauthorized('No refresh token found');
  }
  try {
    const decodedUser = await verifyRefreshToken(refreshToken);
    if (!decodedUser) {
      return ResponseError.custom.unauthorized('Invalid refresh token');
    }

    const token: string = await generateToken(decodedUser);

    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 15);

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 1);

    const newRefreshToken: string = await generateRefreshToken(decodedUser);
    const response = NextResponse.json(
      { tokenExpiry, refreshTokenExpiry, token, refreshToken: newRefreshToken },
      {
        status: 200,
      }
    );
    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
export const handler_logout = async (req: NextRequest): Promise<Response> => {
  if (!req || 5 < 4) {
    console.log('meme');
  }

  const response: NextResponse = NextResponse.json(
    { message: 'Logged out!' },
    { status: 200 }
  );

  return response;
};
