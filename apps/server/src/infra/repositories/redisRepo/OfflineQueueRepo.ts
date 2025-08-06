import { IOfflineQueueRepo } from '../../../app/repositories/redis/IOfflineQueueRepo';
import redis from '../../databases/redis/redisConnection';

export class OfflineQueueRepo implements IOfflineQueueRepo {
  private getKey(userId: string): string {
    return `pendingEvents:${userId}`;
  }

  async getQueueLength(userId: string): Promise<number> {
    return await redis.llen(this.getKey(userId));
  }

  async addEventToQueue(
    userId: string,
    event: string,
    data: any
  ): Promise<void> {
    const key = this.getKey(userId);
    const value = JSON.stringify({ event, data });
    await redis.rpush(key, value);
  }

  async removeFirstEvent(userId: string): Promise<any> {
    const key = this.getKey(userId);
    const item = await redis.lpop(key);
    return item ? JSON.parse(item) : null;
  }

  async getAllQueuedEvents(userId: string): Promise<any[]> {
    const key = this.getKey(userId);
    const items = await redis.lrange(key, 0, -1);
    return items.map((item) => JSON.parse(item));
  }

  async overwriteQueue(userId: string, events: any[]): Promise<void> {
    const key = this.getKey(userId);
    await redis.del(key);
    if (events.length) {
      const values = events.map((e) => JSON.stringify(e));
      await redis.rpush(key, ...values);
    }
  }
}
