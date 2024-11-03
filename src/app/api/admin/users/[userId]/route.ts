import { NextRequest } from 'next/server';
import {
  handler_AdminDeleteUser as deleteUser,
  handler_AdminSoftDeleteUser as softDelete,
} from '@/utils/handlers/User/delete';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const getParams = new URL(req.url).searchParams;
  const softDeleteRequest = getParams.get('soft') === 'true';
  if (softDeleteRequest) {
    return await softDelete(req, params.userId);
  }
  return await deleteUser(req, params.userId);
}
