import { registerUser } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<Response> {
  return await registerUser(request);
}
