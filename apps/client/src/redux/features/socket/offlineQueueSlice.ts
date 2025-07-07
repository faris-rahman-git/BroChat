import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventEmitType } from '@bro/shared';

type OfflineQueueTypes = {
  queue: EventEmitType[];
};

const initialState: OfflineQueueTypes = {
  queue: [],
};

const offlineQueueSlice = createSlice({
  name: 'offlineQueue',
  initialState,
  reducers: {
    addEventToQueue(state, action: PayloadAction<EventEmitType>) {
      state.queue.push(action.payload);
    },
    removeEventAtIndex: (state, action: PayloadAction<number>) => {
      state.queue.splice(action.payload, 1);
    },
    incrementRetryCountAtIndex(state, action: PayloadAction<number>) {
      const item = state.queue[action.payload];
      item.retryCount = item.retryCount || 0;
      if (item) {
        item.retryCount += 1;
        if (item.retryCount >= 10) {
          item.failed = true;
        }
      }
    },
  },
});

export const {
  addEventToQueue,
  removeEventAtIndex,
  incrementRetryCountAtIndex,
} = offlineQueueSlice.actions;
export default offlineQueueSlice.reducer;
