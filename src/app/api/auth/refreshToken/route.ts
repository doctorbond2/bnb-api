import { NextRequest } from 'next/server';
import { refreshTokens } from '@/utils/handlers/Auth/post';
export async function POST(request: NextRequest): Promise<Response> {
  return await refreshTokens(request);
}
