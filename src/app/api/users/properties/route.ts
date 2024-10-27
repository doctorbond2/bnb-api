import { NextRequest } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
import { handler_createNewProperty as createProperty } from '@/utils/handlers/Property/post';
export async function POST(req: NextRequest): Promise<Response> {
  return await createProperty(req);
}

export async function GET(req: NextRequest) {
  return await getProperties(req);
}
// export async function GET(req: NextRequest): Promise<Response> {
//   return await createProperty(req);
// }
