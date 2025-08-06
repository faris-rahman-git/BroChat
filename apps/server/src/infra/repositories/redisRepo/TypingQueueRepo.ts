import { ITypingQueueRepo } from '../../../app/repositories/redis/ITypingQueueRepo';
import redis from '../../databases/redis/redisConnection';

export class TypingQueueRepo implements ITypingQueueRepo {
  private getKey(senderId: string) {
    return `typing:${senderId}`;
  }

  async checkStartTypingIncludes(
    senderId: string,
    receiverId: string
  ): Promise<number> {
    return await redis.sismember(this.getKey(senderId), receiverId);
  }

  async addStartTypingToQueue(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    await redis.sadd(this.getKey(senderId), receiverId);
  }

  async removeStartTypingFromQueue(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    await redis.srem(this.getKey(senderId), receiverId);
  }

  async getAllTypingReceivers(senderId: string): Promise<string[]> {
    return await redis.smembers(this.getKey(senderId));
  }

  async clearTypingQueue(senderId: string): Promise<void> {
    await redis.del(this.getKey(senderId));
  }
}
