import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import db from '@/models/classes/prisma';
export async function handler_GetUserList(): Promise<Response> {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
export async function handler_GetAllUsers(): Promise<Response> {
  const users = await db.admin.getAllUsers();
  return NextResponse.json(users);
}
// export async function getUserById(id: number) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id,
//     },
//   });
//   return user;
// }
