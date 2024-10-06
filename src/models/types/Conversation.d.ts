import { Conversation as PrismaConversation } from '@prisma/client';

export interface Conversation extends PrismaConversation {
  conversationName?: string;
}
