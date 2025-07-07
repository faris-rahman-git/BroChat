// messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageType } from '@bro/shared';

type MessageState = {
  messagesByConversation: {
    [conversationId: string]: MessageType[];
  };
};

const initialState: MessageState = {
  messagesByConversation: {},
};

const newMessageSlice = createSlice({
  name: 'newMessages',
  initialState,
  reducers: {
    addNewMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: MessageType }>
    ) => {
      const { conversationId, message } = action.payload;

      // Initialize array if not present
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }

      const exists = state.messagesByConversation[conversationId].some(
        (msg) => msg._id === message._id
      );

      if (!exists) {
        state.messagesByConversation[conversationId].push(message);
      }
    },

    removeOneConversation: (state, action: PayloadAction<string>) => {
      delete state.messagesByConversation[action.payload];
    },

    resetNewMessages: (state) => {
      state.messagesByConversation = {};
    },
  },
});

export const { addNewMessage, removeOneConversation, resetNewMessages } =
  newMessageSlice.actions;

export default newMessageSlice.reducer;
