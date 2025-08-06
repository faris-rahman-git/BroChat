export interface IMessageDeleteRepo {
  deleteMessageForUser(messageId: string, userId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  deleteMessageBySenderId(senderId: string): Promise<void>;
}
