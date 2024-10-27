import { LoginUser } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest): Promise<Response> {
  return await LoginUser(request);
}
