import { NextRequest } from 'next/server';
import { handler_DeleteProperty } from '@/utils/handlers/Property/delete';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  return await handler_DeleteProperty(req, params.propertyId);
}
