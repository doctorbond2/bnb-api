import { NextResponse, NextRequest } from 'next/server';
import { handler_DeleteUser } from '@/utils/handlers/User/delete';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return await handler_DeleteUser(req, params.id);
}
