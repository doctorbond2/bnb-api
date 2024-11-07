import { NextResponse, NextRequest } from 'next/server';
import { handler_DeleteUser } from '@/utils/handlers/User/delete';
import { handler_GetUserStatus } from '@/utils/handlers/User/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  if (!status) {
    return NextResponse.json({ message: 'Returned user: ' + params.userId });
  }
  console.log('status: ', status);
  console.log('id: ', params.userId);
  return await handler_GetUserStatus(params.userId);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<Response> {
  return await handler_DeleteUser(req, params.userId);
}
