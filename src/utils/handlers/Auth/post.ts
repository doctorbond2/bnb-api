import prisma from '@/lib/prisma';
import ResponseError from '@/models/classes/responseError';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
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
export const LoginUser = async (req: NextRequest): Promise<Response> => {
  const body: User = await req.json();
  const [hasErrors, errors] = validateLoginBody(body);
  if (hasErrors) {
    return errors;
  }

  try {
    const user: User | null = await prisma.user.findUnique({
      where: { username: body.username.toLowerCase() },
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
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin ? true : false,
    };
    return NextResponse.json({
      user: userFrontend,
      token,
      refreshToken,

      message: 'You are logged in.',
      status: 200,
    });
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
    const user = await PrismaKit.user.create(body, hashedPassword);
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);

    const userFrontend: UserFrontend = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: !!user.admin,
    };
    return NextResponse.json({
      data: {
        user: userFrontend,
        token,
        refreshToken,
      },
      message: 'You are registered.',
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
  const body = await req.json();

  if (!body.refreshToken) {
    return ResponseError.custom.unauthorized('No refresh token found');
  }

  const { refreshToken } = body;

  try {
    const decodedUser = await verifyRefreshToken(refreshToken);
    if (!decodedUser) {
      return ResponseError.custom.unauthorized('Invalid refresh token');
    }

    const token: string = await generateToken(decodedUser);

    const newRefreshToken: string = await generateRefreshToken(decodedUser);

    return NextResponse.json({
      data: {
        token,
        refreshToken: newRefreshToken,
      },
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
