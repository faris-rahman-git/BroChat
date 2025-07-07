import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Receiver = {
  conversationId: string | null;
  receiverId: string | null;
  name: string | null;
  email: string | null;
  phoneNumber?: number | null;
  username: string | null;
  avatar: string | null;
  createdAt: Date | null;
  isOnline?: boolean;
  isTyping?: boolean;
};

const initialState: Receiver = {
  conversationId: '',
  receiverId: null,
  name: null,
  email: null,
  phoneNumber: null,
  username: null,
  avatar: null,
  createdAt: null,
  isOnline: false,
  isTyping: false,
};

const activeReceiverSlice = createSlice({
  name: 'activeReceiver',
  initialState,
  reducers: {
    setActiveReceiver(state, action: PayloadAction<{ receiver: Receiver }>) {
      state.conversationId = action.payload.receiver.conversationId;
      state.receiverId = action.payload.receiver.receiverId;
      state.name = action.payload.receiver.name;
      state.email = action.payload.receiver.email;
      state.phoneNumber = action.payload.receiver.phoneNumber;
      state.username = action.payload.receiver.username;
      state.avatar = action.payload.receiver.avatar;
      state.createdAt = action.payload.receiver.createdAt;
      state.isOnline = action.payload.receiver.isOnline ?? false;
      state.isTyping = action.payload.receiver.isTyping ?? false;
    },

    setActiveReceiverConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
    },

    setTypingStatus(state, action: PayloadAction<{ status: boolean }>) {
      state.isTyping = action.payload.status;
    },

    clearActiveReceiver(state) {
      state.conversationId = null;
      state.receiverId = null;
      state.name = null;
      state.email = null;
      state.phoneNumber = null;
      state.username = null;
      state.avatar = null;
      state.createdAt = null;
      state.isOnline = false;
      state.isTyping = false;
    },
  },
});

export const {
  setActiveReceiver,
  clearActiveReceiver,
  setActiveReceiverConversationId,
  setTypingStatus,
} = activeReceiverSlice.actions;
export default activeReceiverSlice.reducer;
