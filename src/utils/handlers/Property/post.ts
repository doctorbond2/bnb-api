import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { Property } from '@/models/types/Property';
import { validateNewProperty as validateIncomingData } from '@/utils/helpers/property';
export async function handler_createNewProperty(
  req: NextRequest
): Promise<Response> {
  const body: Property = await req.json();
  const [hasErrors, errors] = await validateIncomingData(body);
  if (hasErrors) {
    return errors;
  }
  const userId = req.cookies.get('userId')?.value;
  if (!userId) {
    return ResponseError.custom.unauthorized('User not authorized');
  }
  try {
    await PrismaKit.property.createProperty(body, userId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log('Error creating property: ', error);
    return ResponseError.default.internalServerError();
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
