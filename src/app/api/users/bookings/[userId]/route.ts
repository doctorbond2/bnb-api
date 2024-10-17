import { NextRequest } from 'next/server';
import { handler_GetUserBookings } from '@/utils/handlers/Booking/get';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const id = params.userId;
  return await handler_GetUserBookings(req, id);
}
// export const OPTIONS = async () => {
//   return new NextResponse('', { status: 200 });
// };
