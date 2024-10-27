import ResponseError from '@/models/classes/responseError';
import { UpdateProfileInformation } from '@/models/types/Auth';
import { filterUpdateDetails } from '@/utils/helpers/filters';
import { validateUpdateProfileBody } from '@/utils/helpers/auth';
import { comparePassword, hashPassword } from '@/utils/helpers/password';
import { UserFrontend } from '@/models/types/User';
import prisma from '@/lib/prisma';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';

import { NextRequest, NextResponse } from 'next/server';
import { DB_Updated_User } from '@/models/types/Database';
export async function handler_UpdateUser(req: NextRequest): Promise<Response> {
  const body: UpdateProfileInformation = await req.json();

  const [hasError, errors] = await validateUpdateProfileBody(body);
  if (hasError) {
    return errors;
  }
  const { userId } = auth(req);
  try {
    const dbRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });
    if (!dbRecord || dbRecord.id !== userId) {
      return ResponseError.custom.notFound('User not found');
    }

    const validPassword = await comparePassword(
      body.existing_password,
      dbRecord.password
    );
    if (!validPassword) {
      return ResponseError.custom.forbidden('Invalid password');
    }
    const newUserData: DB_Updated_User = filterUpdateDetails(body);

    if (newUserData.password) {
      newUserData.password = await hashPassword(body.password as string);
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbRecord.id },
      data: newUserData,
    });
    const userFrontend: UserFrontend = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      admin: updatedUser.admin ? true : false,
    };
    return NextResponse.json({ user: userFrontend }, { status: 200 });
  } catch (err) {
    console.error('Error:', err);
    return ResponseError.default.internalServerError();
  }
}
