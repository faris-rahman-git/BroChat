import { ObjectId } from 'mongodb';

export type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'seen';

export type MessageType = {
  tempId?: string | null;
  _id?: string | null | ObjectId;
  conversationId: string | null | ObjectId;
  senderId: string | ObjectId;
  MessageType: string;
  content?: string | null;
  mediaUrl?: string | null;
  deliveredBy?: { userId?: string | null | ObjectId; time: Date }[];
  readBy?: { userId?: string | null | ObjectId; time: Date }[];
  status: MessageStatusType;
  messageTime: Date | string;
  createdAt?: Date;
};
