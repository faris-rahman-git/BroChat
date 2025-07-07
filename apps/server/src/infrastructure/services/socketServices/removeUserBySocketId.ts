import redis from '../../../config/redis';

export const removeUserBySocketId = async (socketId: string) => {
  const userId = await redis.get(`socket:${socketId}`);
  if (userId) {
    await redis.del(`user:${userId}`);
    await redis.del(`socket:${socketId}`);
  }
  return userId;
};
