export interface IMessageDeleteRepo {
  deleteMessageForUser(messageIds: string[], userId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  deleteMessageBySenderId(senderId: string): Promise<void>;
  removeReaction(messageId: string, userId: string): Promise<void>;
}
