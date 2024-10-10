import ResponseError from '@/models/classes/responseError';
import { NextRequest, NextResponse } from 'next/server';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { ERROR_internalServerError } from '@/utils/helpers/error';
import { getPageQuery } from '@/utils/helpers/url';
import PrismaKit from '@/models/classes/prisma';
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
    const bookings = await PrismaKit.admin.getAllBookings(pageQuery);
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
    const booking = await PrismaKit.booking.getById(bookingId);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (err) {
    return ERROR_internalServerError(err);
  }
}
