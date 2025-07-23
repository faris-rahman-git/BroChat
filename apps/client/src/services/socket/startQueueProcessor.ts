import { getSocket } from '@client/configs/socket';
import { store } from '@client/redux/store';
import { processOfflineQueue } from './processOfflineQueue';

let isProcessing = false;

export const startQueueProcessor = async () => {
  if (isProcessing) return;

  isProcessing = true;

  while (true) {
    const socket = getSocket();
    const online = navigator.onLine;
    const queue = store.getState().offlineQueue.queue;

    if (!socket?.connected || !online) {
      isProcessing = false;
      return;
    }

    if (queue.length === 0) {
      isProcessing = false;
      return;
    }

    // Process one full round
    await processOfflineQueue();
  }
};
