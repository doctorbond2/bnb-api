import { NextRequest, NextResponse } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { hostId: string } }
) {
  console.log('TEST PROTECETD WAY TRIGGERED');
  const id = params.hostId;
  return await getProperties(req, id);
}

export const OPTIONS = async () => {
  return new NextResponse('', { status: 200 });
};
