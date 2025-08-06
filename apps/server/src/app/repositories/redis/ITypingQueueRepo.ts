export interface ITypingQueueRepo {
  checkStartTypingIncludes(
    senderId: string,
    receiverId: string
  ): Promise<number>;
  addStartTypingToQueue(senderId: string, receiverId: string): Promise<void>;
  removeStartTypingFromQueue(
    senderId: string,
    receiverId: string
  ): Promise<void>;
  getAllTypingReceivers(senderId: string): Promise<string[]>;
  clearTypingQueue(senderId: string): Promise<void>;
}
