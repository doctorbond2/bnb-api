import prisma from '@/lib/prisma';
import { Property } from '../types/Property';
import { Booking } from '../types/Booking';
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
      await prisma.property.create({
        data: {
          ...data,
          hostId,
        },
      });
    },
    updateProperty: async (data: Property) => {
      await prisma.property.update({
        where: {
          id: data.id,
        },
        data,
      });
    },
  };
  static user = {
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
          email,
        },
      });
      return user ? false : true;
    },
  };
  static booking = {
    createBooking: async (data: Booking) => {
      await prisma.booking.create({
        data,
      });
    },
    checkBookingAvailability: async (booking: Booking) => {
      const { startDate, endDate } = booking;
      const isAvailable = await prisma.property.findFirst({
        where: {
          id: 'propertyId',
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
    cancelBooking: async (bookingId: string) => {
      await prisma.booking.delete({
        where: {
          id: bookingId,
        },
      });
    },
  };
}
export default PrismaKit;
