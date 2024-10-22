import { NextRequest, NextResponse } from 'next/server';
import { handler_GetPropertyListByHostId as getProperties } from '@/utils/handlers/Property/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { hostId: string } }
) {
  const id = params.hostId;
  return await getProperties(req, id);
}

export const OPTIONS = async () => {
  return new NextResponse('', { status: 200 });
};
