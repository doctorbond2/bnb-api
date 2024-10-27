import { NextRequest } from 'next/server';
import { handler_AcceptRejectBooking } from '@/utils/handlers/Booking/put';

export async function PUT(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_AcceptRejectBooking(req, params.bookingId);
}
