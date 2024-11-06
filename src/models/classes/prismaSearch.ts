import prisma from '@/lib/prisma';
import { Property } from '../types/Property';
import { UserFrontend } from '../types/User';
export default class PrismaSearch {
  constructor() {}
  static async getPropertyList(searchQuery: string): Promise<Property[]> {
    return await prisma.property.findMany({
      where: {
        available: true,
        deletedAt: null,
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            city: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            country: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
  static async searchUsersAndProperties(
    searchQuery: string
  ): Promise<(UserFrontend | Property)[]> {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        admin: true,
        username: true,
        _count: {
          select: { hosted_properties: { where: { available: true } } },
        },
      },
    });
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            city: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            country: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return [...users, ...properties];
  }
}
