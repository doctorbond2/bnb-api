import { LoginUser } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest): Promise<Response> {
  console.log('Login route');
  return await LoginUser(request);
}
