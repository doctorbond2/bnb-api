import ResponseError from '@/models/classes/responseError';
import { NextRequest, NextResponse } from 'next/server';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { ERROR_internalServerError } from '@/utils/helpers/error';
import { getPageQuery } from '@/utils/helpers/url';
import db from '@/models/classes/prisma';
import { Booking } from '@/models/types/Booking';
export async function handler_GetAllBookings(
  req: NextRequest
): Promise<Response> {
  const { isAdmin } = auth(req);

  if (!isAdmin) {
    return ResponseError.default.unauthorized();
  }
  const { searchParams } = new URL(req.url);
  const pageQuery = getPageQuery(searchParams);
  if (!pageQuery) {
    return ResponseError.default.badRequest();
  }
  try {
    const bookings = await db.admin.getAllBookings(pageQuery);
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (err) {
    return ERROR_internalServerError(err);
  }
}

export async function handler_GetBookingById(
  req: NextRequest,
  id: string
): Promise<Response> {
  const { isAdmin, userId } = auth(req);

  if (!id) {
    return ResponseError.default.badRequest_IdRequired();
  }
  if (!isAdmin && !userId) {
    return ResponseError.default.unauthorized();
  }

  const bookingId = id;
  try {
    const booking = await db.booking.getById(bookingId);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (err) {
    return ERROR_internalServerError(err);
  }
}
export async function handler_GetUserBookings(
  req: NextRequest
): Promise<Response> {
  const { userId } = auth(req);
  if (!userId) {
    return ResponseError.default.unauthorized();
  }
  try {
    const bookings: Booking[] =
      (await db.booking.getAllUserBookings(userId)) || [];
    console.log('bookings', bookings);
    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    return ERROR_internalServerError(err);
  }
}
