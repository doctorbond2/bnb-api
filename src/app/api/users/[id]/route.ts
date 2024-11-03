import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Updated user: ' + params.id });
}
