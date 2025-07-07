import { getSocketIdByUserId } from '../../../services/socketServices/getReceiverSocketId';
import { EmitOptions } from '../../../../domain/entities/socketTypes/offlineQueueType';
import { emitToUserWithTimer } from './emitToUserWithTimer';
import { processServerOfflineQueue } from './processServerOfflineQueue';
import { optimizeTypingAndQueue } from './optimizeTypingAndQueue';

export const emitWithQueueServer = async ({
  userId,
  event,
  data,
  isDirect = false,
}: EmitOptions & { isDirect?: boolean }): Promise<void> => {
  try {
    const socketId = await getSocketIdByUserId(userId);

    if (!socketId) {
      await optimizeTypingAndQueue(userId, event, data);
      return;
    }

    const ackReceived = await emitToUserWithTimer({
      socketId,
      event,
      data,
    });

    if (!ackReceived) {
      await optimizeTypingAndQueue(userId, event, data);
      if (isDirect) await processServerOfflineQueue(userId);
    }
  } catch (err) {
    console.error(`emitWithQueueServer error:`, err);
    await optimizeTypingAndQueue(userId, event, data);
  }
};
