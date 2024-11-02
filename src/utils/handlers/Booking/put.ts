import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { extractUserAuthData as auth } from '@/utils/helpers/auth';
import { BookingAcception } from '@/models/types/Booking';
import { ERROR_badRequest } from '@/utils/helpers/error';
import { generateConfirmationCode } from '@/utils/helpers/password';
import db from '@/models/classes/prisma';

export async function handler_AcceptRejectBooking(
  req: NextRequest,
  id: string
): Promise<Response> {
  const { userId } = auth(req);
  const body: BookingAcception = await req.json();
  if (!userId) {
    return ResponseError.default.unauthorized();
  }

  const bookingId = id;
  if (!bookingId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  if (typeof body.decision !== 'boolean') {
    return ResponseError.default.badRequest();
  }
  const confirmationCode = generateConfirmationCode();

  try {
    await db.booking.decideBooking(
      bookingId,
      userId,
      body.decision,
      confirmationCode
    );
    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return ResponseError.custom.internalServerError(error.message);
    } else {
      return ERROR_badRequest(error);
    }
  }
}

export async function handler_HostCancelBookings(
  req: NextRequest,
  id: string
): Promise<Response> {
  const { userId } = auth(req);
  const bookingId = id;
  if (!bookingId) {
    return ResponseError.default.badRequest_IdRequired();
  }
  try {
    await db.booking.hostCancelBooking(bookingId, userId);
    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return ResponseError.custom.internalServerError(error.message);
    } else {
      return ERROR_badRequest(error);
    }
  }
}
