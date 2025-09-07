import { Types } from 'mongoose';
import { ContentType } from '@bro/shared';

export type populatedSenderIdType = {
  name: string;
  avatar: string;
  _id: Types.ObjectId;
};

export type populatedReplyToType = {
  _id: Types.ObjectId;
  senderId: Omit<populatedSenderIdType, 'avatar'>;
  MessageType: ContentType;
  content?: string;
  mediaUrl?: string;
};

export type DelivedByOrReadByType = {
  userId?: Types.ObjectId | null;
  time: NativeDate;
};
