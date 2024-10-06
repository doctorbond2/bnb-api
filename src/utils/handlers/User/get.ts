import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function getUserList(req: NextRequest): Promise<Response> {
  const users = await prisma.user.findMany();
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
