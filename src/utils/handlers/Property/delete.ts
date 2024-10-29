import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { ERROR_badRequest } from '@/utils/helpers/error';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import PrismaKit from '@/models/classes/prisma';

export async function handler_DeleteProperty(
  req: NextRequest,
  id: string
): Promise<Response> {
  const propertyId = id;
  if (!propertyId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId, isAdmin } = auth(req);

  try {
    await PrismaKit.property.delete(propertyId, userId, isAdmin);
    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
export async function handler_UserDeleteProperty(
  req: NextRequest,
  id: string
): Promise<Response> {
  const propertyId = id;
  if (!propertyId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId } = auth(req);

  try {
    await PrismaKit.property.delete(propertyId, userId);
    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
