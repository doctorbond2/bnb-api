import { NextRequest, NextResponse } from 'next/server';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { getPageQuery } from '@/utils/helpers/url';
import PrismaKit from '@/models/classes/prisma';
import { ERROR_badRequest } from '@/utils/helpers/error';
import ResponseError from '@/models/classes/responseError';
import { Property } from '@/models/types/Property';
export async function handler_GetPropertyListByHostId(
  req: NextRequest,
  id: string
): Promise<Response> {
  const hostId = id;
  console.log('hostId', hostId);
  if (!hostId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId } = auth(req);

  try {
    const properties: Property[] = await PrismaKit.property.getHostedProperties(
      userId
    );
    console.log('properties', properties);
    return NextResponse.json(properties, { status: 200 });
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

  const getParams = new URL(req.url).searchParams;
  const populateBookings = getParams.get('populateBookings') === 'true';
  try {
    const property = await PrismaKit.property.getById(
      propertyId,
      populateBookings
    );
    return NextResponse.json(property, { status: 200 });
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
    const propertyList = await PrismaKit.property.getAll(pageQuery);
    console.log('propertyList', propertyList);
    return NextResponse.json(propertyList, { status: 200 });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
