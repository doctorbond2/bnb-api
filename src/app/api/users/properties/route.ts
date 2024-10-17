import { NextRequest } from 'next/server';
import { handler_createNewProperty as createProperty } from '@/utils/handlers/Property/post';
export async function POST(req: NextRequest): Promise<Response> {
  return await createProperty(req);
}
// export async function GET(req: NextRequest): Promise<Response> {
//   return await createProperty(req);
// }
