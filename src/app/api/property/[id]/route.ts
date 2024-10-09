import { handler_DeleteProperty as deleteProperty } from '@/utils/handlers/Property/delete';
import { NextRequest } from 'next/server';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;

  return await deleteProperty(req, id);
}
