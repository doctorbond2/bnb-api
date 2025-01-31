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
    const cancelledBooking = await PrismaKit.booking.cancel(bookingId, userId);
    return NextResponse.json(cancelledBooking, { status: 200 });
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
export async function handler_adminCancelBooking(
  req: NextRequest,
  id: string
): Promise<Response> {
  const bookingId = id;
  if (!bookingId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    const cancelledBooking = await PrismaKit.admin.cancel_booking(bookingId);
    return NextResponse.json(cancelledBooking, { status: 200 });
  } catch (error) {
    console.log('Error canceling booking: ', error);
    return ResponseError.default.internalServerError();
  }
}
export async function handler_AdminDeleteManyBookings(
  req: NextRequest
): Promise<Response> {
  const { bookingIds } = await req.json();
  if (!bookingIds) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    await PrismaKit.admin.delete_many_bookings(bookingIds);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log('Error deleting bookings: ', error);
    return ResponseError.default.internalServerError();
  }
}
