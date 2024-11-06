import { NextResponse, NextRequest } from 'next/server';
import { handler_GetUserById } from '@/utils/handlers/User/get';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return await handler_GetUserById(params.id);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Updated user: ' + params.id });
}
