import { ICallRoomRepo } from '../../../app/repositories/redis/ICallRoomRepo';
import redis from '../../databases/redis/redisConnection';
import { callInfoType } from '@bro/shared';

export class CallRoomRepo implements ICallRoomRepo {
  private getUserKey(userId: string): string {
    return `user:call:room:${userId}`;
  }
  private getRoomKey(roomId: string): string {
    return `room:call:${roomId}`;
  }

  async saveUser(
    userId: string,
    name: string,
    avatar: string,
    isVideoCall: boolean,
    audio: boolean = true
  ): Promise<void> {
    const key = this.getUserKey(userId);
    const type = await redis.type(key);
    if (type !== 'none' && type !== 'string') {
      await redis.del(key);
    }

    const userData = {
      userName: name,
      userAvatar: avatar,
      video: isVideoCall,
      audio,
    };
    await redis.set(key, JSON.stringify(userData));
  }

  async getUser(userId: string): Promise<callInfoType | null> {
    const key = this.getUserKey(userId);
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async deleteUser(userId: string): Promise<void> {
    await redis.del(this.getUserKey(userId));
  }

  async addUserToRoom(roomId: string, userId: string): Promise<void> {
    await redis.sadd(this.getRoomKey(roomId), userId);
  }

  async removeUserFromRoom(roomId: string, userId: string): Promise<void> {
    await redis.srem(this.getRoomKey(roomId), userId);
  }

  async getRoomMembers(roomId: string): Promise<string[]> {
    return await redis.smembers(this.getRoomKey(roomId));
  }
}
