import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { generateConfirmationCode } from '@/utils/helpers/password';
import PrismaKit from '@/models/classes/prisma';
import { Booking } from '@/models/types/Booking';
export async function handler_CreateBooking(
  req: NextRequest
): Promise<Response> {
  const body: Booking = await req.json();
  try {
    const isAvailable = await PrismaKit.checkBookingAvailability(body);
    if (!isAvailable) {
      return ResponseError.custom.badRequest(
        'Property is not available for the selected dates'
      );
    }
    body.confirmationCode = generateConfirmationCode();

    await PrismaKit.createBooking(body);
    return NextResponse.json({
      confirmationCode: body.confirmationCode,
      status: 204,
    });
  } catch (error) {
    console.log('Error creating booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
