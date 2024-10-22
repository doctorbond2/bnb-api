import { Image as PrismaImage } from '@prisma/client';

export interface Image extends PrismaImage {
  comments?: string;
}
export interface NewImage {
  url: string;
  alt: string;
  propertyId: string;
}
