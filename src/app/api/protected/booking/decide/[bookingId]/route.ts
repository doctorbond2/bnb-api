import { NextRequest } from 'next/server';
import { handler_AcceptRejectBooking } from '@/utils/handlers/Booking/put';
import { handler_HostCancelBookings } from '@/utils/handlers/Booking/put';
export async function PUT(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  return await handler_AcceptRejectBooking(req, params.bookingId);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return await handler_HostCancelBookings(req, params.id);
}
