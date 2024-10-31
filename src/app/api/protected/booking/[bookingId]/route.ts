import { NextRequest } from 'next/server';
import { handler_CancelBooking } from '@/utils/handlers/Booking/delete';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_CancelBooking(req, params.bookingId);
}
