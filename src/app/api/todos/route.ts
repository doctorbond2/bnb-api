import { NextResponse, NextRequest } from 'next/server';
import { CreateTodo } from '@/utils/handlers/Todo/post';
export async function GET() {
  return NextResponse.json({ status: 200 });
}
export async function POST(req: NextRequest): Promise<Response> {
  return await CreateTodo(req);
}
