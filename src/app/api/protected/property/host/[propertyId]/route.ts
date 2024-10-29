import { NextResponse, NextRequest } from 'next/server';
import { handler_HostCancelBookings } from '@/utils/handlers/Booking/put';
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> => {
  return await handler_HostCancelBookings(req, params.id);
};
export const OPTIONS = async () => {
  return new NextResponse('', { status: 200 });
};
