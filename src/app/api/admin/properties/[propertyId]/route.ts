import { NextRequest } from 'next/server';
import {
  handler_DeleteProperty as deleteProperty,
  handler_AdminSoftDeleteProperty as softDeleteProperty,
} from '@/utils/handlers/Property/delete';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  return await deleteProperty(req, params.propertyId);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  return await softDeleteProperty(req, params.propertyId);
}
