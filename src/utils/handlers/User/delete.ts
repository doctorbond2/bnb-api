import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import db from '@/models/classes/prisma';

export async function handler_DeleteUser(req: NextRequest, id: string) {
  const userId = id;
  if (!userId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId: authUserId } = auth(req);
  if (userId !== authUserId) {
    return ResponseError.default.forbidden();
  }
  try {
    await db.user.delete(userId);
    return NextResponse.json({ status: 204 });
  } catch {
    return ResponseError.default.internalServerError();
  }
}
export async function handler_AdminDeleteUser(req: NextRequest, id: string) {
  const userId = id;
  if (!userId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { password }: { password: string } = await req.json();
  if (!userId || !password) {
    return ResponseError.default.badRequest();
  }
  if (password !== process.env.ADMIN_DELETE_PW) {
    return ResponseError.custom.unauthorized('Invalid password.');
  }
  try {
    await db.admin.delete_user(userId);
    return NextResponse.json({ status: 204 });
  } catch (err) {
    console.log(err);
    return ResponseError.default.internalServerError();
  }
}
export async function handler_AdminSoftDeleteUser(
  req: NextRequest,
  id: string
) {
  const userId = id;
  if (!userId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    await db.admin.soft_delete_user(userId);
    return NextResponse.json({ status: 204 });
  } catch {
    return ResponseError.default.internalServerError();
  }
}
export async function handler_AdminDeleteManyUsers(req: NextRequest) {
  const { userIds, password }: { userIds: string[]; password: string } =
    await req.json();
  if (!userIds || !password) {
    return ResponseError.default.badRequest();
  }
  if (password !== process.env.ADMIN_DELETE_PW) {
    return ResponseError.custom.unauthorized('Invalid password.');
  }
  try {
    await db.admin.delete_many_users(userIds);
    return NextResponse.json({ status: 204 });
  } catch {
    return ResponseError.default.internalServerError();
  }
}
