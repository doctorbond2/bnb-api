import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';

export async function handler_CancelBooking(
  req: NextRequest,
  id: string
): Promise<Response> {
  const bookingId = id;
  if (!bookingId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  const { userId, isAdmin } = auth(req);
  try {
    await PrismaKit.booking.delete(bookingId, userId, isAdmin);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log('Error canceling booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
