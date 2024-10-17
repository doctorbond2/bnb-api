import { NextRequest } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { hostId: string } }
) {
  console.log('TEST USER WAY TRIGGERED');
  const id = params.hostId;
  return await getProperties(req, id);
}
//FORTSÄTT MED GET REQUEST PROPERTIES VIA HOST ID
