import { handler_DeleteProperty as deleteProperty } from '@/utils/handlers/Property/delete';
import { NextRequest } from 'next/server';
import { handler_UpdateProperty } from '@/utils/handlers/Property/put';
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;

  return await deleteProperty(req, id);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;

  return await handler_UpdateProperty(req, id);
}
