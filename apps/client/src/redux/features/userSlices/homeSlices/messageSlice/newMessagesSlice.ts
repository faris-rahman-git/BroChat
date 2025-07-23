import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditMessageType, MessageType } from '@bro/shared';

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

    deleteOneMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const messages =
        state.messagesByConversation[action.payload.conversationId];
      if (!messages) return;
      state.messagesByConversation[action.payload.conversationId] =
        messages.filter((msg) => msg._id !== action.payload.messageId);
    },

    editOneMessage: (state, action: PayloadAction<EditMessageType>) => {
      const messages =
        state.messagesByConversation[action.payload.conversationId];
      if (!messages) return;
      const msg = messages.find((m) => m._id === action.payload.messageId);
      if (msg) {
        msg.content = action.payload.message;
        msg.isEdited = true;
      }
    },
  },
});

export const {
  addNewMessage,
  removeOneConversation,
  resetNewMessages,
  deleteOneMessage,
  editOneMessage,
} = newMessageSlice.actions;

export default newMessageSlice.reducer;
