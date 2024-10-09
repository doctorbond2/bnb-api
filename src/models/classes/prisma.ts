import prisma from '@/lib/prisma';
import { Property } from '../types/Property';
import { ErrorMessages } from '../enums/errorMessages';
import { Booking } from '../types/Booking';
import { RegisterInformation } from '../types/Auth';
import { get } from 'http';

//IMPLEEMETERA DELETE USER BRÄH
class PrismaKit {
  contructor() {}

  static property = {
    createProperty: async (data: Property, hostId: string) => {
      if (
        !data.availableFrom ||
        !data.availableUntil ||
        data.availableFrom > data.availableUntil
      ) {
        data.available = false;
      }

      const isUser = await this.user.checkId(hostId);
      if (!isUser) {
        throw new Error('User not found');
      }

      const existingProperty = await prisma.property.findFirst({
        where: {
          city: data.city,
          country: data.country,
          address: data.address,
        },
      });
      if (existingProperty) {
        throw new Error(ErrorMessages.LISTED_PROPERTY_EXISTS);
      }

      await prisma.property.create({
        data: {
          ...data,
          hostId,
        },
      });
    },
    getHostedProperties: async (hostId: string) => {
      return (
        (await prisma.property.findMany({
          where: {
            hostId,
          },
        })) || []
      );
    },
    getById: async (propertyId: string) => {
      return await prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      });
    },
    getAll: async (pageQuery: { page: number; pageSize: number }) => {
      const { page, pageSize } = pageQuery;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const properties = await prisma.property.findMany({
        skip,
        take,
        where: {
          available: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const totalProperties = await prisma.property.count();
      return {
        currentPage: page,
        totalPages: Math.ceil(totalProperties / pageSize),
        data: properties,
      };
    },
    update: async (data: Property) => {
      await prisma.property.update({
        where: {
          id: data.id,
        },
        data,
      });
    },
    delete: async (propertyId: string, userId: string, isAdmin?: boolean) => {
      try {
        if (isAdmin) {
          await this.admin.delete_property(propertyId);
          return;
        }
        const propertyBookings = await this.booking.getAllPropertyBookings(
          propertyId
        );
        if (propertyBookings.length > 0) {
          throw new Error(ErrorMessages.PROPERTY_HAS_BOOKINGS);
        }
        const property = await prisma.property.findUnique({
          where: {
            id: propertyId,
            hostId: userId,
          },
        });
        if (!property) {
          throw new Error(ErrorMessages.PROPERTY_USER_MISMATCH);
        }
        await prisma.property.delete({
          where: {
            id: property.id,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };

  static user = {
    create: async (body: RegisterInformation, hashedPassword: string) => {
      const user = await prisma.user.create({
        data: {
          email: body.email.toLowerCase(),
          username: body.username.toLowerCase(),
          password: hashedPassword,
          firstName: body.firstName.toLowerCase(),
          lastName: body.lastName.toLowerCase(),
          admin: !!body.admin,
        },
      });
      if (!user) {
        throw new Error('User not created');
      }
      return user;
    },
    checkId: async (id: string) => {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user ? true : false;
    },

    checkUsernameAvailability: async (username: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: {
          username: username.toLowerCase(),
        },
      });
      return user ? false : true;
    },
    checkEmailAvailability: async (email: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      return user ? false : true;
    },
  };
  static booking = {
    create: async (data: Booking) => {
      await prisma.booking.create({
        data,
      });
    },
    checkBookingAvailability: async (booking: Booking) => {
      const { startDate, endDate, propertyId } = booking;
      const isAvailable = await prisma.property.findFirst({
        where: {
          id: propertyId,
          availableFrom: {
            lte: startDate,
          },
          availableUntil: {
            gte: endDate,
          },
          bookings: {
            none: {
              startDate: {
                lte: endDate,
              },
              endDate: {
                gte: startDate,
              },
            },
          },
        },
      });
      return isAvailable;
    },
    delete: async (bookingId: string, userId: string, isAdmin?: boolean) => {
      try {
        if (isAdmin) {
          await this.admin.delete_booking(bookingId);
        }
        await prisma.booking.delete({
          where: {
            id: bookingId,
            userId,
          },
        });
      } catch (error) {
        throw error;
      }
    },

    getAllPropertyBookings: async (propertyId: string) => {
      return await prisma.booking.findMany({ where: { propertyId } });
    },
  };
  static admin = {
    delete_property: async (propertyId: string) => {
      await prisma.property.delete({
        where: {
          id: propertyId,
        },
      });
      await prisma.booking.deleteMany({
        where: { propertyId },
      });
    },
    delete_booking: async (bookingId: string) => {
      await prisma.booking.delete({
        where: {
          id: bookingId,
        },
      });
    },
    getAllProperties: async (pageQuery: { page: number; pageSize: number }) => {
      const { page, pageSize } = pageQuery;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      return await prisma.property.findMany({ skip, take });
    },
    getAllHosts: async (pageQuery: { page: number; pageSize: number }) => {
      const { page, pageSize } = pageQuery;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      return await prisma.user.findMany({
        skip,
        take,
        where: {
          hosted_properties: {
            some: {},
          },
        },
        include: {
          hosted_properties: true,
        },
      });
    },
  };
}
export default PrismaKit;
