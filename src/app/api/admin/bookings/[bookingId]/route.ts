import { NextRequest } from 'next/server';
import { handler_DeleteBooking } from '@/utils/handlers/Booking/delete';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_DeleteBooking(req, params.bookingId);
}
