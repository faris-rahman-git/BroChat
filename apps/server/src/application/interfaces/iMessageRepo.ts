import { MessageStatusType, MessageType } from '@bro/shared';
import { Types } from 'mongoose';

export interface iMessageRepo {
  findByTempId(tempId: string): Promise<Types.ObjectId | null>;
  save(data: MessageType , receiversId: string[]): Promise<MessageType>;
  findMessages(conversationId: string, userId: string): Promise<MessageType[]>;
  updateMessageStatus(
    messageId: string,
    receiverId: string,
    status: MessageStatusType
  ): Promise<MessageStatusType | null>;
  deleteMessageForUser(messageId: string, userId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  editMessage(messageId: string, message: string , senderId: string): Promise<void>;
}
