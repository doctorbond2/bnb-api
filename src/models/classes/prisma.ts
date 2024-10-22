import prisma from '@/lib/prisma';
import { Property } from '../types/Property';
import { ErrorMessages } from '../enums/errorMessages';
import { NewBooking, NewBookingData } from '../types/Booking';
import { RegisterInformation } from '../types/Auth';
import { BookingStatusEnum as STATUS } from '../enums/general';
import { NewImage } from '../types/Image';
import { uploadPropertyImages } from '@/utils/helpers/uploadImage';

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

      return await prisma.$transaction(async (prisma) => {
        const newDbEntry = await prisma.property.create({
          data: {
            ...data,
            hostId,
          },
        });

        if (data.propertyImageUrls && data.propertyImageUrls.length > 0) {
          const secureImageUrls = await uploadPropertyImages(
            data.propertyImageUrls
          );

          const dbImages: NewImage[] = secureImageUrls.map(
            (imageUrl: string, index: number) => ({
              url: imageUrl,
              alt: `property-image-${index}-${imageUrl.split('/').pop()}`,
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
          hostId: userId,
        },
      });
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
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };
  static booking = {
    create: async (data: NewBooking) => {
      await prisma.booking.create({
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
      console.log('startDate', startDate);
      console.log('endDate', endDate);
      console.log('propertyId', propertyId);
      // const property = await prisma.property.findFirst({
      //   where: { id: propertyId },
      // });
      // console.log('property', property);
      const isAvailable = await prisma.property.findFirst({
        where: {
          id: propertyId,
          availableFrom: {
            lte: startDate, // startDate must be after or on availableFrom
          },
          availableUntil: {
            gte: endDate, // endDate must be before or on availableUntil
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
      console.log('isAvailable:', isAvailable);
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
    getAllUserBookings: async (userId: string) => {
      console.log('searching for bookings with userId:', userId);
      return await prisma.booking.findMany({ where: { userId } });
    },
    getAllPropertyBookings: async (propertyId: string) => {
      return await prisma.booking.findMany({ where: { propertyId } });
    },
    decideBooking: async (
      bookingId: string,
      hostId: string,
      decision: boolean,
      isAdmin: boolean
    ) => {
      try {
        if (isAdmin) {
          this.admin.accept_or_reject_booking(bookingId, decision);
          return;
        }
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
    getById: async (bookingId: string) => {
      return await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
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
    delete_user: async (userId: string) => {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      await prisma.booking.deleteMany({
        where: { userId },
      });
      await prisma.property.deleteMany({
        where: { hostId: userId },
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
          hosted_properties: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
    getAllBookings: async (pageQuery: { page: number; pageSize: number }) => {
      const { page, pageSize } = pageQuery;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      return await prisma.booking.findMany({
        skip,
        take,
        select: {
          userId: true,
          propertyId: true,
          startDate: true,
          endDate: true,
        },
      });
    },
  };
}
export default PrismaKit;
