import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { NewBooking, NewBookingData } from '@/models/types/Booking';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { BookingStatusEnum as STATUS } from '@/models/enums/general';
export async function handler_CreateBooking(
  req: NextRequest
): Promise<Response> {
  const body: NewBookingData = await req.json();

  try {
    const { userId } = auth(req);
    if (!userId) {
      return ResponseError.custom.badRequest('User not found');
    }
    const isAvailable = await PrismaKit.booking.checkBookingAvailability(body);
    if (!isAvailable) {
      return ResponseError.custom.badRequest(
        'Property is not available for the selected dates'
      );
    }
    const isHost = await PrismaKit.property.isHost(userId, body.propertyId);
    if (isHost) {
      return ResponseError.custom.badRequest(
        'Host cannot book their own property'
      );
    }

    const booking: NewBooking = {
      ...body,
      status: STATUS.PENDING,
      userId,
    };

    const newDbEntry = await PrismaKit.booking.create(booking);
    return NextResponse.json(newDbEntry, { status: 201 });
  } catch (error) {
    console.log('Error creating booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
