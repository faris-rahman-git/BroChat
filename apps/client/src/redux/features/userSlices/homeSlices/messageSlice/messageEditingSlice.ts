// messageEditingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditMessageType } from '@bro/shared';

const initialState: Partial<EditMessageType> = {};

const messageEditingSlice = createSlice({
  name: 'editingMessage',
  initialState,
  reducers: {
    setEditingMessage: (state, action: PayloadAction<EditMessageType>) => {
      state.messageId = action.payload.messageId;
      state.conversationId = action.payload.conversationId;
      state.message = action.payload.message;
    },
    clearEditingMessage: () => ({}),
  },
});

export const { setEditingMessage, clearEditingMessage } =
  messageEditingSlice.actions;

export default messageEditingSlice.reducer;
