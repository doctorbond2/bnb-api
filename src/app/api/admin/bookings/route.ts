import { handler_GetAllBookings } from '@/utils/handlers/Booking/get';
import { handler_AdminDeleteManyBookings } from '@/utils/handlers/Booking/delete';
import { NextRequest } from 'next/server';

export async function GET() {
  return await handler_GetAllBookings();
}
export async function DELETE(req: NextRequest) {
  return await handler_AdminDeleteManyBookings(req);
}
