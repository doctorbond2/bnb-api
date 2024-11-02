import { NextRequest } from 'next/server';
import { handler_GetPropertyById } from '@/utils/handlers/Property/get';
import { handler_GetPropertyForBooking } from '@/utils/handlers/Property/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id;
  const getParams = new URL(req.url).searchParams;
  const populateBookings = getParams.get('populateBookings') === 'true';
  if (populateBookings) {
    return handler_GetPropertyForBooking(propertyId);
  }
  return handler_GetPropertyById(req, propertyId);
}
