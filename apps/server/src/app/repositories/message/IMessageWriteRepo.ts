import { MessageStatusType, MessageType } from '@bro/shared';

export interface IMessageWriteRepo {
  save(data: MessageType, receiversId: string[]): Promise<MessageType>;
  editMessage(
    messageId: string,
    message: string,
    senderId: string
  ): Promise<void>;
  updateMessageStatus(
    messageId: string,
    receiverId: string,
    status: MessageStatusType
  ): Promise<MessageStatusType | null>;

  addOrUpdateReaction(messageId: string, emoji: string, userId: string): Promise<void>;
}
