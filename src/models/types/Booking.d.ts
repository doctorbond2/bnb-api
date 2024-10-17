import { Booking as PrismaBooking } from '@prisma/client';
import { BookingStatus } from '../enums/general';
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
export type BookingStatusType = BookingStatus;
export interface NewBookingData {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  customer: Customer;
  comments?: string;
}

export interface NewBooking
  extends Omit<NewBookingData, 'createdAt' | 'updatedAt' | 'id'> {
  confirmationCode: string;
  userId: string;
  pending: boolean;
  accepted: boolean | null;
  comments?: string;
  customer: Prisma.Json & Customer;
}
export type BookingStatus = boolean;
export interface BookingAcception {
  decision: boolean;
  comments?: string;
}
