import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EditMessageType,
  MessageStatusType,
  MessageType,
  ReactionsType,
} from '@bro/shared';

type MessagesState = {
  [conversationId: string]: MessageType[];
};

const initialState: MessagesState = {};

const messageHistorySlice = createSlice({
  name: 'messageHistory',
  initialState,
  reducers: {
    setMessagesForConversation: (
      state,
      action: PayloadAction<{ conversationId: string; messages: MessageType[] }>
    ) => {
      state[action.payload.conversationId] = action.payload.messages;
    },
    appendMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: MessageType }>
    ) => {
      if (!state[action.payload.conversationId]) {
        state[action.payload.conversationId] = [];
      }
      state[action.payload.conversationId].push(action.payload.message);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        status: MessageStatusType;
      }>
    ) => {
      const messages = state[action.payload.conversationId];
      if (!messages) return;
      const msg = messages.find((m) => m._id === action.payload.messageId);
      if (msg) msg.status = action.payload.status;
    },
    editMessage: (state, action: PayloadAction<EditMessageType>) => {
      const messages = state[action.payload.conversationId];
      if (!messages) return;

      const msg = messages.find((m) => m._id === action.payload.messageId);
      if (msg) {
        msg.content = action.payload.message;
        msg.isEdited = true;
      }
    },
    replaceMessageByTempId: (
      state,
      action: PayloadAction<{
        conversationId: string;
        tempId: string;
        savedMessage: MessageType;
      }>
    ) => {
      const { tempId, savedMessage, conversationId } = action.payload;
      const tempConversationId = `temp-${tempId}`;

      if (!state[conversationId]) {
        state[conversationId] = [...state[tempConversationId]];
        delete state[tempConversationId];
      }

      state[conversationId] = state[conversationId].map((msg) =>
        msg.tempId === tempId ? savedMessage : msg
      );
    },
    deleteMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const messages = state[action.payload.conversationId];
      if (!messages) return;
      state[action.payload.conversationId] = messages.filter(
        (msg) => msg._id !== action.payload.messageId
      );
    },

    addReaction: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        reaction: ReactionsType;
      }>
    ) => {
      const { conversationId, messageId, reaction } = action.payload;

      const messages = state[conversationId];
      if (!messages) return;

      const msg = messages.find((m) => m._id === messageId);
      if (!msg) return;

      if (!msg.reactions) {
        msg.reactions = [];
      }

      const existingReaction = msg.reactions.find(
        (r) => r.userId === reaction.userId
      );

      if (existingReaction) {
        existingReaction.emoji = reaction.emoji;
      } else {
        msg.reactions.push(reaction);
      }
    },

    removeReaction: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        userId: string;
      }>
    ) => {
      const { conversationId, messageId, userId } = action.payload;

      const messages = state[conversationId];
      if (!messages) return;

      const msg = messages.find((m) => m._id === messageId);
      if (!msg || !msg.reactions) return;

      msg.reactions = msg.reactions.filter((r) => r.userId !== userId);
    },
  },
});

export const {
  setMessagesForConversation,
  appendMessage,
  updateMessageStatus,
  replaceMessageByTempId,
  deleteMessage,
  editMessage,
  addReaction,
  removeReaction,
} = messageHistorySlice.actions;

export default messageHistorySlice.reducer;
