import {
  addEventToQueue,
  getLength,
  removeFirstEvent,
} from '../../../infrastructure/services/redis/OfflinequeueEvents';

export const cleanUpInvalidQueueEvents = async (
  userId: string
): Promise<void> => {
  const length = await getLength(userId);
  if (length === 0) return;
  for (let i = 0; i < length; i++) {
    let rawItem = await removeFirstEvent(userId);

    if (!rawItem) break;

    const { event, data } = rawItem;

    if (
      event !== 'force-logout' &&
      event !== 'new-user-chat' &&
      event !== 'user-offline' &&
      event !== 'user-online'
    ) {
      await addEventToQueue(userId, event, data);
    }
  }
};
