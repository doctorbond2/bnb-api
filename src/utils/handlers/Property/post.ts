import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { NewPropertyData } from '@/models/types/Property';
import { ERROR_badRequest } from '@/utils/helpers/error';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { validateNewProperty as validateIncomingData } from '@/utils/helpers/property';
export async function handler_createNewProperty(
  req: NextRequest
): Promise<Response> {
  const body: NewPropertyData = await req.json();

  const [hasErrors, errors] = await validateIncomingData(body);
  if (hasErrors) {
    console.log('Validation error in createNewProperty');
    return errors;
  }
  const { userId } = auth(req);

  if (!userId) {
    return ResponseError.custom.unauthorized('User not authorized');
  }

  try {
    const newProperty = await PrismaKit.property.createProperty(body, userId);
    if (!newProperty) {
      return ResponseError.custom.badRequest('Failed to create property');
    }
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}
