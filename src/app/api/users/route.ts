import { NextRequest } from 'next/server';
import { handler_UpdateUser as UpdateUser } from '@/utils/handlers/User/put';
import { getUserList } from '@/utils/handlers/User/get';
export async function PUT(req: NextRequest): Promise<Response> {
  return await UpdateUser(req);
}
export async function GET(req: NextRequest): Promise<Response> {
  return await getUserList(req);
}
