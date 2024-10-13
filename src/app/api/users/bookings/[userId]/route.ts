import { NextRequest } from 'next/server';
import { handler_GetUserBookings } from '@/utils/handlers/Booking/get';

export async function GET(req: NextRequest) {
  return await handler_GetUserBookings(req);
}
