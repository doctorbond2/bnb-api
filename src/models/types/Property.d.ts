import { Property as PrismaProperty } from '@prisma/client';
export interface Property extends PrismaProperty {
  comments?: string;
  propertyImageFiles?: File[];
}
