import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { Property } from '@/models/types/Property';
import { ERROR_badRequest } from '@/utils/helpers/error';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { validateNewProperty as validateIncomingData } from '@/utils/helpers/property';
export async function handler_createNewProperty(
  req: NextRequest
): Promise<Response> {
  const body: Property = await req.json();
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
    await PrismaKit.property.createProperty(body, userId);
    return NextResponse.json({ status: 201 });
  } catch (error: unknown) {
    return ERROR_badRequest(error);
  }
}

// const isAvailable = await prisma.property.findFirst({
//   where: {
//     id: 'property-id',
//     availableFrom: {
//       lte: desiredStartDate,  // Property must be available on or before the desired start date
//     },
//     availableUntil: {
//       gte: desiredEndDate,    // Property must be available on or after the desired end date
//     },
//     bookings: {
//       none: {
//         startDate: {
//           lte: desiredEndDate, // No bookings should start before or during the desired end date
//         },
//         endDate: {
//           gte: desiredStartDate, // No bookings should end after or during the desired start date
//         },
//       },
//     },
//   },
// });
