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
export const handler_GetUserStatus = async (id: string) => {
  if (!id) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }
  const userStatus = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      hosted_properties: {
        include: { _count: true },
        where: { deletedAt: null },
      },
      bookings: {
        include: { _count: true },
        where: { NOT: { status: { in: ['cancelled', 'rejected'] } } },
      },
    },
  });
  console.log(userStatus);
  if (!userStatus) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ data: userStatus, status: 200 });
};
// export async function getUserById(id: number) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id,
//     },
//   });
//   return user;
// }
