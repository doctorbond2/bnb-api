import { NextRequest } from 'next/server';
import { handler_createNewProperty } from '@/utils/handlers/Property/post';
export async function POST(req: NextRequest): Promise<Response> {
  return await handler_createNewProperty(req);
}
