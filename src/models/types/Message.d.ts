import { Message as PrismaMessage } from '@prisma/client';

export interface Message
  extends Omit<
    PrismaMessage,
    'sentById' | 'conversationId' | 'createdAt' | 'updatedAt'
  > {
  sentBy?: string;
  conversation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface MessageFrontend
  extends Omit<Message, 'sentBy' | 'conversation'> {
  length?: number;
}
