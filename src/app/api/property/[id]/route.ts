import { NextRequest } from 'next/server';
import { handler_GetPropertyById } from '@/utils/handlers/Property/get';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id;
  return handler_GetPropertyById(req, propertyId);
}
