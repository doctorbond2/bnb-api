import prisma from '@/lib/prisma';
import { Property } from '../types/Property';
import { ErrorMessages } from '../enums/errorMessages';
import { NewBooking, NewBookingData } from '../types/Booking';
import { RegisterInformation } from '../types/Auth';
import { BookingStatusEnum as STATUS } from '../enums/general';
import { NewImage } from '../types/Image';
import { NewPropertyData } from '../types/Property';
class PrismaKit {
  contructor() {}
  static property = {
    createProperty: async (data: NewPropertyData, hostId: string) => {
      if (
        !data.availableFrom ||
        !data.availableUntil ||
        data.availableFrom > data.availableUntil
      ) {
        data.available = false;
      }
      const imageUrls = data.imageUrls || null;

      delete data.imageUrls;
      const isUser = await this.user.checkId(hostId);
      if (!isUser) {
        throw new Error('User not found');
      }

      const existingProperty = await prisma.property.findFirst({
        where: {
          name: data.name,
          city: data.city,
          country: data.country,
          address: data.address,
        },
      });
      if (existingProperty) {
        throw new Error(ErrorMessages.LISTED_PROPERTY_EXISTS);
      }

      return await prisma.$transaction(async (prisma) => {
        const newDbEntry = await prisma.property.create({
          data: {
            ...data,
            hostId,
          },
        });
        if (imageUrls && imageUrls.length > 0) {
          const dbImages: NewImage[] = imageUrls.map(
            (imageUrl: string, index: number) => ({
              url: imageUrl,
              alt: `property-image-${index}-${
                newDbEntry.id
              }-${new Date().getTime()}`,
              propertyId: newDbEntry.id,
            })
          );

          await prisma.image.createMany({ data: dbImages });
        }
        return newDbEntry;
      });
    },

    getHostedProperties: async (hostId: string) => {
      return (
        (await prisma.property.findMany({
          where: {
            hostId,
            deletedAt: null,
          },
          include: {
            bookings: {
              where: {
                NOT: {
                  status: {
                    in: [STATUS.CANCELLED, STATUS.REJECTED],
                  },
                },
              },
            },
            images: true,
          },
        })) || []
      );
    },
    getById: async (propertyId: string, populateBookings: boolean) => {
      return await prisma.property.findUnique({
        where: { id: propertyId },
        include: populateBookings
          ? {
              bookings: {
                where: {
                  NOT: {
                    status: {
                      in: [STATUS.CANCELLED, STATUS.REJECTED],
                    },
                  },
                },
                select: {
                  startDate: true,
                  endDate: true,
                },
              },
            }
          : undefined,
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
          deletedAt: null,
          available: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          images: true,
          host: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      const totalProperties = await prisma.property.count();
      return {
        currentPage: page,
        totalPages: Math.ceil(totalProperties / pageSize),
        data: properties,
      };
    },
    update: async (data: Property, propertyId: string) => {
      if (data.available === false) {
        data.availableFrom = null;
        data.availableUntil = null;
      }
      return await prisma.property.update({
        where: {
          id: propertyId,
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
        await prisma.property.update({
          where: {
            id: property.id,
          },
          data: {
            deletedAt: new Date(),
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
          deletedAt: null,
        },
      });
      return user ? true : false;
    },
    checkIfHost: async (
      userId: string,
      bookingId: string
    ): Promise<boolean> => {
      const property = await prisma.property.findFirst({
        where: {
          bookings: {
            some: {
              id: bookingId,
            },
          },
          deletedAt: null,
          hostId: userId,
        },
      });
      return !!property;
    },

    getBookings: async (userId: string) => {
      return await prisma.booking.findMany({
        where: {
          userId,
        },
      });
    },

    getProperties: async (userId: string) => {
      return await prisma.property.findMany({
        where: {
          deletedAt: null,
          hostId: userId,
        },
      });
    },
    checkUsernameAvailability: async (username: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: {
          username: username.toLowerCase(),
          deletedAt: null,
        },
      });
      return user ? false : true;
    },
    checkEmailAvailability: async (email: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
          deletedAt: null,
        },
      });
      return user ? false : true;
    },
    delete: async (userId: string) => {
      try {
        const properties = await this.property.getHostedProperties(userId);
        if (properties.length > 0) {
          throw new Error(ErrorMessages.USER_HAS_PROPERTIES);
        }
        const bookings = await this.user.getBookings(userId);
        if (bookings.length > 0) {
          throw new Error(ErrorMessages.USER_HAS_BOOKINGS);
        }
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };
  static booking = {
    create: async (data: NewBooking) => {
      return await prisma.booking.create({
        data: {
          customer: JSON.stringify(data.customer),
          startDate: data.startDate,
          endDate: data.endDate,
          confirmationCode: data.confirmationCode,
          status: data.status,
          propertyId: data.propertyId,
          userId: data.userId,
        },
      });
    },
    checkBookingAvailability: async (booking: NewBookingData) => {
      const { startDate, endDate, propertyId } = booking;
      // const property = await prisma.property.findFirst({
      //   where: { id: propertyId },
      // });

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
            every: { status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] } },
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
    cancel: async (bookingId: string, userId?: string) => {
      try {
        await prisma.booking.update({
          where: {
            id: bookingId,
            userId,
          },
          data: { status: STATUS.CANCELLED },
        });
      } catch (error) {
        throw error;
      }
    },
    hostCancelBooking: async (bookingId: string, hostId: string) => {
      try {
        const booking = await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
        });
        if (!booking) {
          throw new Error(ErrorMessages.BOOKING_NOT_FOUND);
        }
        const property = await prisma.property.findFirst({
          where: {
            id: booking.propertyId,
            hostId,
          },
        });
        if (!property) {
          throw new Error(ErrorMessages.PROPERTY_USER_MISMATCH);
        }
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: { status: STATUS.CANCELLED },
        });
      } catch (error) {
        throw error;
      }
    },
    getAllUserBookings: async (userId: string) => {
      return await prisma.booking.findMany({
        where: { userId },
        include: {
          property: {
            select: {
              name: true,
              host: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    },
    getAllPropertyBookings: async (propertyId: string) => {
      return await prisma.booking.findMany({
        where: {
          propertyId,
          status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] },
        },
      });
    },
    decideBooking: async (
      bookingId: string,
      hostId: string,
      decision: boolean
    ) => {
      try {
        const isHost = await this.user.checkIfHost(hostId, bookingId);
        if (!isHost) {
          throw new Error(ErrorMessages.USER_NOT_HOST);
        }
        const statusUpdate = decision ? STATUS.ACCEPTED : STATUS.REJECTED;
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: statusUpdate,
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        } else {
          throw new Error(String(err));
        }
      }
    },
  };
  static image = {
    add_images: async (images: NewImage[]) => {
      try {
        await prisma.image.createMany({
          data: images,
        });
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        } else {
          throw new Error(String(err));
        }
      }
    },
  };
  static admin = {
    accept_or_reject_booking: async (bookingId: string, decision: boolean) => {
      const statusUpdate = decision ? STATUS.ACCEPTED : STATUS.REJECTED;
      await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: statusUpdate,
        },
      });
    },
    delete_property: async (propertyId: string) => {
      await prisma.property.delete({
        where: {
          id: propertyId,
        },
      });
      await prisma.booking.updateMany({
        where: {
          propertyId,
          NOT: {
            status: STATUS.REJECTED,
          },
        },
        data: { status: STATUS.CANCELLED },
      });
    },
    delete_booking: async (bookingId: string) => {
      await prisma.booking.delete({
        where: {
          id: bookingId,
        },
      });
    },
    delete_user: async (userId: string) => {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });

        await prisma.booking.updateMany({
          where: { userId },
          data: { status: STATUS.CANCELLED },
        });

        await prisma.property.updateMany({
          where: { hostId: userId },
          data: { deletedAt: new Date() },
        });
      });
    },
    getAllProperties: async () => {
      return await prisma.property.findMany();
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
          hosted_properties: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
    getAllUsers: async () => {
      return await prisma.user.findMany();
    },
    getAllBookings: async () => {
      return await prisma.booking.findMany();
    },
    getBookingById: async (bookingId: string) => {
      return await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });
    },
    getPropertyById: async (propertyId: string) =>
      await prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      }),
  };
}
export default PrismaKit;
