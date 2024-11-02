import { NextRequest } from 'next/server';
import { handler_CancelBooking } from '@/utils/handlers/Booking/delete';
import { handler_GetBookingById } from '@/utils/handlers/Booking/get';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_CancelBooking(req, params.bookingId);
}
export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_GetBookingById(req, params.bookingId);
}
