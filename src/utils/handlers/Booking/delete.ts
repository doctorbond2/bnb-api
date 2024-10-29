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
  const { userId } = auth(req);
  try {
    await PrismaKit.booking.cancel(bookingId, userId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log('Error canceling booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
export async function handler_DeleteBooking(
  req: NextRequest,
  id: string
): Promise<Response> {
  const bookingId = id;
  if (!bookingId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    await PrismaKit.admin.delete_booking(bookingId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log('Error deleting booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
