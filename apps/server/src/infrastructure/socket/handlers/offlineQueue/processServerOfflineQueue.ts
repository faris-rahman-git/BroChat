import {
  getLength,
  removeFirstEvent,
} from '../../../services/redis/OfflinequeueEvents';
import { emitWithQueueServer } from './emitWithQueueServer';

export const processServerOfflineQueue = async (userId: string) => {
  while (true) {
    const length = await getLength(userId);
    if (length === 0) break;

    let rawItem = await removeFirstEvent(userId);

    if (!rawItem) break;

    const { event, data } = rawItem;
    await emitWithQueueServer({ userId, event, data, isDirect: false });
  }
};
