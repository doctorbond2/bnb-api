import { NextRequest, NextResponse } from 'next/server';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { getPageQuery } from '@/utils/helpers/url';
import PrismaKit from '@/models/classes/prisma';
import { ERROR_badRequest } from '@/utils/helpers/error';
import ResponseError from '@/models/classes/responseError';
export async function handler_GetPropertyListByHostId(
  req: NextRequest,
  id: string
): Promise<Response> {
  const hostId = id;
  if (!hostId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId } = auth(req);

  try {
    const properties = await PrismaKit.property.getHostedProperties(userId);
    return NextResponse.json({ properties });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
export async function handler_GetPropertyById(
  req: NextRequest,
  id: string
): Promise<Response> {
  const propertyId = id;
  if (!propertyId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    const property = await PrismaKit.property.getById(propertyId);
    return NextResponse.json({ property });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
export async function handler_GetPropertyList(
  req: NextRequest
): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const pageQuery = getPageQuery(searchParams);
  if (pageQuery === null) {
    return ResponseError.default.badRequest();
  }
  try {
    const properties = await PrismaKit.property.getAll(pageQuery);
    return NextResponse.json({ properties });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
