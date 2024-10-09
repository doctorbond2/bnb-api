import { NextRequest } from 'next/server';

import { handler_GetPropertyList as getPropertyList } from '@/utils/handlers/Property/get';
export async function GET(req: NextRequest) {
  return await getPropertyList(req);
}
