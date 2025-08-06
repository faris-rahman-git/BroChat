import { IUserManagementRepo } from '../../../app/repositories/redis/IUserManagementRepo';
import redis from '../../databases/redis/redisConnection';

export class UserManagementRepo implements IUserManagementRepo {
  private getUserKey(userId: string): string {
    return `user:${userId}`;
  }

  private getSocketKey(socketId: string): string {
    return `socket:${socketId}`;
  }

  async findSocketByUserId(userId: string): Promise<string | null> {
    const receiverSocketId = await redis.get(this.getUserKey(userId));
    return receiverSocketId;
  }

  async saveUserToRedis(socketId: string, userId: string): Promise<void> {
    await redis.set(this.getUserKey(userId), socketId);
    await redis.set(this.getSocketKey(socketId), userId);
  }

  async removeUserBySocketId(socketId: string): Promise<string | null> {
    const userId = await redis.get(this.getSocketKey(socketId));
    if (userId) {
      await redis.del(this.getUserKey(userId));
      await redis.del(this.getSocketKey(socketId));
    }
    return userId;
  }
}
