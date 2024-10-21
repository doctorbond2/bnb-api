import { handler_logout } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';
export async function POST(req: NextRequest) {
  return await handler_logout(req);
}
