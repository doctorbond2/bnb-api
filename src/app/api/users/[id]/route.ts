import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
