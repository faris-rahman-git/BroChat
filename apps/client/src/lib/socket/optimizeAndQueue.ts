import {
  removeEventAtIndex,
  addEventToQueue,
} from '@client/redux/features/socket/offlineQueueSlice';
import { store } from '@client/redux/store';
import { EventEmitType } from '../../../../../libs/shared/src/lib/types/socket/socketTypes';

export const optimizeAndQueue = ({ event, data }: EventEmitType) => {
  const state = store.getState();
  const queue = state.offlineQueue.queue;

  if (event === 'stop-typing') {
    const startIndex = queue.findIndex(
      (item) =>
        item.event === 'start-typing' &&
        item.data.receiverId === data.receiverId
    );

    if (startIndex !== -1) {
      store.dispatch(removeEventAtIndex(startIndex));
      return;
    }
  }

  // Add event normally
  store.dispatch(addEventToQueue({ event, data }));
};
