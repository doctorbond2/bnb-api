import { NextRequest } from 'next/server';
import { handler_UpdateUser as UpdateUser } from '@/utils/handlers/User/put';
export async function PUT(req: NextRequest): Promise<Response> {
  return await UpdateUser(req);
}
