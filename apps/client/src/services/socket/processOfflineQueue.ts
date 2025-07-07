import { store } from '@client/redux/store';
import { getSocket } from '@client/configs/socket';
import {
  incrementRetryCountAtIndex,
  removeEventAtIndex,
} from '@client/redux/features/socket/offlineQueueSlice';
import { emitWithTimer } from './emitWithTimer';

export const processOfflineQueue = async () => {
  const socket = getSocket();

  // Do nothing if offline or socket not connected
  if (!socket?.connected || !navigator.onLine) return;

  const queue = store.getState().offlineQueue.queue;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (item.failed) {
      store.dispatch(removeEventAtIndex(i));
      i--;
      continue;
    }
    const ackReceived = await emitWithTimer({
      event: item.event,
      data: item.data,
    });
    if (ackReceived) {
      store.dispatch(removeEventAtIndex(i));
      i--;
    } else {
      store.dispatch(incrementRetryCountAtIndex(i));
    }
  }
};
