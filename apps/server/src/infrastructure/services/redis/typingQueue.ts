import redis from '../../../config/redis';

const getKey = (senderId: string) => `typing:${senderId}`;

export const checkStartTypingIncludes = async (
  senderId: string,
  receiverId: string
) => {
  return await redis.sismember(getKey(senderId), receiverId);
};

export const addStartTypingToQueue = async (
  senderId: string,
  receiverId: string
) => {
  await redis.sadd(getKey(senderId), receiverId);
};

export const removeStartTypingFromQueue = async (
  senderId: string,
  receiverId: string
) => {
  await redis.srem(getKey(senderId), receiverId);
};

export const getAllTypingReceivers = async (
  senderId: string
): Promise<string[]> => {
  return await redis.smembers(getKey(senderId));
};

export const clearTypingQueue = async (senderId: string) => {
  await redis.del(getKey(senderId));
};
