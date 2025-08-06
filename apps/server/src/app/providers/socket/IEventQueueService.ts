import { EmitWithQueueType } from '../../dtos/socketTypes';

export interface IEventQueueService {
  emitWithQueue({
    userId,
    event,
    data,
    isDirect,
  }: EmitWithQueueType): Promise<void>;
  sendPending(userId: string): Promise<void>;
  notifyPresence(userId: string, isOnline: boolean): Promise<void>;
  disconnectSocket(userId: string): Promise<void>;

  emitNewUser(
    userId: string,
    receiverId: string,
    conversationId: string
  ): Promise<void>;
}
