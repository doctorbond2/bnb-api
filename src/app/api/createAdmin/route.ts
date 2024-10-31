import { NextRequest, NextResponse } from 'next/server';
import db from '@/models/classes/prisma';
const adminPassword = process.env.ADMIN_CREATE_PW;
import { hashPassword } from '@/utils/helpers/password';
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('adminPassword:', adminPassword);
  console.log('body.admin_password:', body.admin_password);
  if (body.admin_password !== adminPassword) {
    console.log('Unauthorized');
    return NextResponse.json({ status: 401 });
  }
  console.log('req:', body);
  const hashedPassword = await hashPassword(body.password);
  const newAdmin = await db.admin.createAdmin(body, hashedPassword);
  console.log(newAdmin.deletedAt);
  return NextResponse.json({ status: 201 });
}
