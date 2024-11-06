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
export async function handler_GetUserById(id: string): Promise<Response> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      firstName: true,
      lastName: true,
      hosted_properties: {
        where: {
          available: true,
        },
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          country: true,
          images: true,
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user, { status: 200 });
}
// export async function getUserById(id: number) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id,
//     },
//   });
//   return user;
// }
