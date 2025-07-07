import redis from '../../../config/redis';

export const addUserToRedis = async (socketId: string, userId: string) => {
  await redis.set(`user:${userId}`, socketId);
  await redis.set(`socket:${socketId}`, userId);
};
