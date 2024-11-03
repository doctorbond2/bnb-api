import { NextRequest } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
export async function GET(req: NextRequest) {
  return await getProperties(req);
}
//FORTSÄTT MED GET REQUEST PROPERTIES VIA HOST ID
