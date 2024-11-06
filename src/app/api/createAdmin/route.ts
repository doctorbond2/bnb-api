import { NextRequest, NextResponse } from 'next/server';
import db from '@/models/classes/prisma';
const adminPassword = process.env.ADMIN_CREATE_PW;
import { hashPassword } from '@/utils/helpers/password';
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.admin_password !== adminPassword) {
    return NextResponse.json({ status: 401 });
  }
  const hashedPassword = await hashPassword(body.password);
  const newAdmin = await db.admin.createAdmin(body, hashedPassword);
  console.log(newAdmin.deletedAt);
  return NextResponse.json({ status: 201 });
}
