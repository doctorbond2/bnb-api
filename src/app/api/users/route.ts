import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/utils/handlers/User/put';
import { getUserList } from '@/utils/handlers/User/get';
export async function PUT(req: NextRequest): Promise<Response> {
  return await updateUser(req);
}
export async function GET(req: NextRequest): Promise<Response> {
  return await getUserList(req);
}
