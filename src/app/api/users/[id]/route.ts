import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/types/User';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
export async function PUT(req: NextRequest): Promise<Response> {
  return NextResponse.json({ status: 200 });
}
