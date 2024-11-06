import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import db from '@/models/classes/prisma';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';

export async function handler_UpdateProperty(req: NextRequest, id: string) {
  const propertyId = id;

  if (!propertyId) {
    console.log('no id');
    return ResponseError.default.badRequest_IdRequired();
  }

  const body = await req.json();

  if (!body) {
    return ResponseError.default.badRequest();
  }
  const { userId } = auth(req);
  if (!userId) {
    return ResponseError.custom.unauthorized('User not found');
  }

  try {
    const updatedProperty = await db.property.update(body, propertyId);
    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    return ResponseError.custom.internalServerError((error as Error).message);
  }
}
