import { NextRequest } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { hostId: string } }
) {
  console.log('test', params);
  const id = params.hostId;
  return await getProperties(req, id);
}
//FORTSÄTT MED GET REQUEST PROPERTIES VIA HOST ID
