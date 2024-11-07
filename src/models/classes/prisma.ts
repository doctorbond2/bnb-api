import prisma from '@/lib/prisma';
import { UpdatePropertyFormData } from '../types/Property';
import { ErrorMessages } from '../enums/errorMessages';
import { NewBooking, NewBookingData } from '../types/Booking';
import { RegisterInformation } from '../types/Auth';
import { BookingStatusEnum as STATUS } from '../enums/general';
import { NewImage } from '../types/Image';
import { NewPropertyData } from '../types/Property';
import { calculateTotalCostOfStay as calcTotal } from '@/utils/helpers/math';
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
          deletedAt: null,
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
            deletedAt: null,
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
        return await prisma.property.findUnique({
          where: { id: newDbEntry.id },
          include: {
            images: true,
            bookings: {
              where: {
                NOT: { status: { in: [STATUS.CANCELLED, STATUS.REJECTED] } },
              },
            },
          },
        });
      });
    },

    getHostedProperties: async (hostId: string) => {
      return (
        (await prisma.property.findMany({
          where: {
            hostId,
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
    getById: async (propertyId: string) => {
      return await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          images: true,
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    },
    getForBooking: async (propertyId: string) => {
      return await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          bookings: {
            where: {
              NOT: { status: { in: [STATUS.CANCELLED, STATUS.REJECTED] } },
            },
            select: {
              id: true,
              startDate: true,
              endDate: true,
            },
          },
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
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
              id: true,
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
    update: async (data: UpdatePropertyFormData, propertyId: string) => {
      return await prisma.$transaction(async (prisma) => {
        if (data.available === false) {
          data.availableFrom = null;
          data.availableUntil = null;
        }

        const imageUrls = data.imageUrls || [];
        delete data.imageUrls;
        const newDbEntry = await prisma.property.update({
          where: {
            id: propertyId,
          },
          data,
        });

        console.log('test');
        console.log('propertyId', propertyId);
        await prisma.image.deleteMany({
          where: {
            propertyId,
          },
        });

        const dbImages: NewImage[] = imageUrls.map(
          (imageUrl: string, index: number) => ({
            url: imageUrl,
            alt: `property-image-${index}-${newDbEntry.id}-${Date.now()}`,
            propertyId: newDbEntry.id,
          })
        );
        if (dbImages.length > 0) {
          await prisma.image.createMany({ data: dbImages });
        }

        return await prisma.property.findUnique({
          where: { id: newDbEntry.id },
          include: {
            images: true,
            bookings: {
              where: {
                NOT: { status: { in: [STATUS.CANCELLED, STATUS.REJECTED] } },
              },
            },
          },
        });
      });
    },
    isHost: async (propertyId: string, userId: string) => {
      const property = await prisma.property.findFirst({
        where: {
          id: propertyId,
          hostId: userId,
          deletedAt: null,
        },
      });
      return !!property;
    },
    delete: async (propertyId: string, userId: string) => {
      try {
        const propertyBookings = await this.booking.getAllPropertyBookings(
          propertyId
        );
        if (propertyBookings.length > 0) {
          throw new Error(ErrorMessages.PROPERTY_HAS_BOOKINGS);
        }
        const property = await prisma.property.findUnique({
          where: {
            id: propertyId,
          },
        });
        if (!property || property.hostId !== userId) {
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
          deletedAt: null,
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
        const bookings = await prisma.booking.findMany({
          where: {
            userId,
            status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] },
          },
        });
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
          status: data.status,
          propertyId: data.propertyId,
          userId: data.userId,
        },
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
            none: {
              status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] },
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
      return isAvailable !== null;
    },
    cancel: async (bookingId: string, userId?: string) => {
      try {
        return await prisma.booking.update({
          where: {
            id: bookingId,
            userId,
          },
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
    isBookingRelatedToUser: async (bookingId: string, userId: string) => {
      const isRelated = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          OR: [
            { userId },
            {
              property: {
                hostId: userId,
              },
            },
          ],
        },
      });

      return !!isRelated;
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
    getById: async (bookingId: string) => {
      return await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          property: {
            select: {
              name: true,
              price_per_night: true,
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
      decision: boolean,
      confirmationCode: string
    ) => {
      await prisma.$transaction(async (prisma) => {
        try {
          const isHost = await this.user.checkIfHost(hostId, bookingId);
          if (!isHost) {
            throw new Error(ErrorMessages.USER_NOT_HOST);
          }
          const dbPropertyEntry = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
            include: { property: { select: { price_per_night: true } } },
          });
          if (!dbPropertyEntry) {
            throw new Error(ErrorMessages.BOOKING_NOT_FOUND);
          }
          const totalCost = calcTotal(
            dbPropertyEntry.startDate,
            dbPropertyEntry.endDate,
            dbPropertyEntry.property.price_per_night
          );
          const data = {
            status: decision ? STATUS.ACCEPTED : STATUS.REJECTED,
            confirmationCode: decision ? confirmationCode : undefined,
            price_total: decision ? totalCost : undefined,
          };
          return await prisma.booking.update({
            where: {
              id: bookingId,
            },

            data,
          });
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message);
          } else {
            throw new Error(String(err));
          }
        }
      });
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
    cancel_booking: async (bookingId: string) => {
      return await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: STATUS.CANCELLED,
        },
      });
    },
    delete_property: async (propertyId: string) => {
      await prisma.property.delete({
        where: {
          id: propertyId,
        },
      });
    },
    soft_delete_property: async (propertyId: string) => {
      await prisma.$transaction(async (prisma) => {
        await prisma.booking.updateMany({
          where: {
            propertyId,
            status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] },
          },
          data: { status: STATUS.CANCELLED },
        });
        await prisma.property.update({
          where: {
            id: propertyId,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      });
    },
    delete_booking: async (bookingId: string) => {
      await prisma.booking.delete({
        where: {
          id: bookingId,
        },
      });
    },
    delete_many_bookings: async (bookingIds: string[]) => {
      await prisma.booking.deleteMany({
        where: {
          id: {
            in: bookingIds,
          },
        },
      });
    },
    soft_delete_user: async (userId: string) => {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        const properties = await prisma.property.findMany({
          where: { hostId: userId },
          select: { id: true },
        });
        if (properties.length > 0) {
          const propertyIds = properties.map((property) => property.id);

          await prisma.booking.updateMany({
            where: {
              propertyId: { in: propertyIds },
              status: { notIn: [STATUS.CANCELLED, STATUS.REJECTED] },
            },
            data: { status: STATUS.CANCELLED },
          });
        }
        await prisma.property.updateMany({
          where: { hostId: userId },
          data: { deletedAt: new Date() },
        });
      });
    },
    delete_user: async (userId: string) => {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    },
    delete_many_users: async (userIds: string[]) => {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
    },

    getAllProperties: async () => {
      return await prisma.property.findMany({
        include: { bookings: true, images: true },
      });
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
    createAdmin: async (body: RegisterInformation, hashedPassword: string) => {
      const user = await prisma.user.create({
        data: {
          email: body.email.toLowerCase(),
          username: body.username.toLowerCase(),
          password: hashedPassword,
          firstName: body.firstName.toLowerCase(),
          lastName: body.lastName.toLowerCase(),
          admin: true,
          deletedAt: null,
        },
      });
      if (!user) {
        throw new Error('User not created');
      }
      return user;
    },
  };
}
export default PrismaKit;
