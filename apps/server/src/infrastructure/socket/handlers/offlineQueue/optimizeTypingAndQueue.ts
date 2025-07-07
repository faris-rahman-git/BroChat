import {
  addEventToQueue,
  getAllQueuedEvents,
  overwriteQueue,
} from '../../../services/redis/OfflinequeueEvents';

export const optimizeTypingAndQueue = async (
  userId: string,
  event: string,
  data: any
) => {
  if (
    event === 'typing-status' &&
    typeof data?.status === 'boolean' &&
    typeof data?.senderId === 'string'
  ) {
    const { senderId, status } = data;
    const queue = await getAllQueuedEvents(userId);

    if (status === false) {
      // Case: stop-typing
      const index = queue.findIndex(
        (item) =>
          item.event === 'typing-status' &&
          item.data?.status === true &&
          item.data?.senderId === senderId
      );

      if (index !== -1) {
        queue.splice(index, 1); // remove matching start-typing
        await overwriteQueue(userId, queue);
        return; // skip stop-typing
      }

      // Also prevent duplicate stop-typing
      const alreadyQueuedStop = queue.some(
        (item) =>
          item.event === 'typing-status' &&
          item.data?.status === false &&
          item.data?.senderId === senderId
      );

      if (alreadyQueuedStop) {
        return; // skip duplicate stop-typing
      }

    } else {
      // Case: start-typing

      // First check if a matching stop-typing is already queued — cancel both
      const stopIndex = queue.findIndex(
        (item) =>
          item.event === 'typing-status' &&
          item.data?.status === false &&
          item.data?.senderId === senderId
      );

      if (stopIndex !== -1) {
        queue.splice(stopIndex, 1); // remove stop-typing
        await overwriteQueue(userId, queue);
      }

      // Prevent duplicate start-typing
      const alreadyQueuedStart = queue.some(
        (item) =>
          item.event === 'typing-status' &&
          item.data?.status === true &&
          item.data?.senderId === senderId
      );

      if (alreadyQueuedStart) {
        return; // skip duplicate start-typing
      }
    }
  }

  await addEventToQueue(userId, event, data);
};
