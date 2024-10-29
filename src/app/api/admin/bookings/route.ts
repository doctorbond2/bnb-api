import { handler_GetAllBookings } from '@/utils/handlers/Booking/get';

export async function GET() {
  return await handler_GetAllBookings();
}
