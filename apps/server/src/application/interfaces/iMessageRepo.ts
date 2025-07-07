import { MessageStatusType, MessageType } from '@bro/shared';
import {  Types } from 'mongoose';

export interface iMessageRepo {
  findByTempId(tempId: string): Promise<Types.ObjectId | null>;
  save(data: MessageType): Promise<MessageType>;
  findMessages(conversationId: string): Promise<MessageType[]>;
  updateMessageStatus(
    messageId: string,
    status: MessageStatusType
  ): Promise<void>;
}
