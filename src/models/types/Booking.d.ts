import { Booking as PrismaBooking } from '@prisma/client';
export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
export interface Booking extends PrismaBooking {
  comments?: string;
  customer: Prisma.Json & Customer;
}
