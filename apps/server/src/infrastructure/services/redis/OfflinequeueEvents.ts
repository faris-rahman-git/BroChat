import redis from '../../../config/redis';

const getKey = (userId: string) => `pendingEvents:${userId}`;

export const getLength = async (userId: string): Promise<number> => {
  const key = getKey(userId);
  const length = await redis.llen(key);
  return length;
};

export const addEventToQueue = async (
  userId: string,
  event: string,
  data: any
): Promise<void> => {
  const key = getKey(userId);
  const value = JSON.stringify({ event, data });
  await redis.rpush(key, value);
};

export const removeFirstEvent = async (userId: string) => {
  const key = getKey(userId);
  const item = await redis.lpop(key);
  return item ? JSON.parse(item) : null;
};

export const getAllQueuedEvents = async (userId: string) => {
  const key = getKey(userId);
  const items = await redis.lrange(key, 0, -1);
  return items.map((item) => JSON.parse(item));
};

export const overwriteQueue = async (userId: string, events: any[]) => {
  const key = getKey(userId);
  await redis.del(key);
  if (events.length) {
    const values = events.map((e) => JSON.stringify(e));
    await redis.rpush(key, ...values);
  }
};
