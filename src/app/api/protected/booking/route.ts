import { NextRequest } from 'next/server';
import { handler_CreateBooking } from '@/utils/handlers/Booking/post';
export async function POST(req: NextRequest) {
  return await handler_CreateBooking(req);
}
