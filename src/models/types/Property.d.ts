import { Property as PrismaProperty } from '@prisma/client';
export interface Property extends PrismaProperty {
  comments?: string;
  propertyImageFiles?: File[];
}
export interface NewPropertyData {
  name: string;
  country: string;
  city: string;
  address: string;
  price_per_night: number;
  available: boolean;
  availableFrom: Date | null;
  availableUntil: Date | null;
  imageUrls?: string[];
}
