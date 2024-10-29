import { NextRequest } from 'next/server';
import { handler_GetAllProperties } from '@/utils/handlers/Property/get';
export async function GET(req: NextRequest) {
  return await handler_GetAllProperties(req);
}
