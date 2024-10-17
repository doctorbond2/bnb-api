import { NextRequest } from 'next/server';
import { handler_createNewProperty as createProperty } from '@/utils/handlers/Property/post';
// export async function GET(req: NextRequest) {
//   return 'Hello from the API';
// }
export async function POST(req: NextRequest) {
  return await createProperty(req);
}
