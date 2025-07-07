import redis from '../../../config/redis';

export const getSocketIdByUserId = async (userId: string) => {
  const receiverSocketId = await redis.get(`user:${userId}`);
  return receiverSocketId;
};
