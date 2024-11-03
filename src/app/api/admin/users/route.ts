import { NextRequest } from 'next/server';
import { handler_GetAllUsers } from '@/utils/handlers/User/get';
import { handler_AdminDeleteManyUsers as DeleteMany } from '@/utils/handlers/User/delete';
export async function GET() {
  return await handler_GetAllUsers();
}
export async function DELETE(req: NextRequest) {
  return await DeleteMany(req);
}
