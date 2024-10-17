import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { generateConfirmationCode } from '@/utils/helpers/password';
import PrismaKit from '@/models/classes/prisma';
import { NewBooking, NewBookingData } from '@/models/types/Booking';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
export async function handler_CreateBooking(
  req: NextRequest
): Promise<Response> {
  const body: NewBookingData = await req.json();

  try {
    const isAvailable = await PrismaKit.booking.checkBookingAvailability(body);
    const { userId } = auth(req);
    if (!userId) {
      return ResponseError.custom.badRequest('User not found');
    }
    if (!isAvailable) {
      return ResponseError.custom.badRequest(
        'Property is not available for the selected dates'
      );
    }

    const booking: NewBooking = {
      ...body,
      confirmationCode: generateConfirmationCode(),
      pending: true,
      accepted: false,
      userId,
    };

    await PrismaKit.booking.create(booking);
    return NextResponse.json(
      {
        confirmationCode: booking.confirmationCode,
      },
      { status: 204 }
    );
  } catch (error) {
    console.log('Error creating booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
