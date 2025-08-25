import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Receiver } from '@client/types/ReduxTypes';
import { updateGroupInfoType } from '@bro/shared';

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
  isGroup: false,
  about: null,
  isBlockedByMe: false,
  hasBlockedMe: false,
  isSubscribed: false,
  isBlocked: false,
  isExclusive: false,
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
      state.isGroup = action.payload.receiver.isGroup ?? false;
      state.about = action.payload.receiver.about;
      state.isBlockedByMe = action.payload.receiver.isBlockedByMe;
      state.hasBlockedMe = action.payload.receiver.hasBlockedMe;
      state.isSubscribed = action.payload.receiver.isSubscribed ?? false;
      state.isBlocked = action.payload.receiver.isBlocked ?? false;
      state.isExclusive = action.payload.receiver.isExclusive ?? false;
    },

    setActiveReceiverConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
    },

    setTypingStatus(state, action: PayloadAction<{ status: boolean }>) {
      state.isTyping = action.payload.status;
    },

    clearActiveReceiver(state, action: PayloadAction<string>) {
      if (state.conversationId === action.payload) {
        state.conversationId = '';
        state.receiverId = null;
        state.name = null;
        state.email = null;
        state.phoneNumber = null;
        state.username = null;
        state.avatar = null;
        state.createdAt = null;
        state.isOnline = false;
        state.isTyping = false;
        state.isGroup = false;
        state.about = null;
        state.isBlockedByMe = false;
        state.hasBlockedMe = false;
        state.isSubscribed = false;
        state.isBlocked = false;
        state.isExclusive = false;
      }
    },

    updateActiveReceiver(
      state,
      action: PayloadAction<{
        conversationId: string;
        groupInfo: updateGroupInfoType;
      }>
    ) {
      if (state.conversationId == action.payload.conversationId) {
        state.name = action.payload.groupInfo.groupName;
        state.avatar = action.payload.groupInfo.avatar;
        state.about = action.payload.groupInfo.about;
      }
    },

    updateBlockUserStatus(
      state,
      action: PayloadAction<{
        conversationId: string;
        isBlockedByMe?: boolean;
        hasBlockedMe?: boolean;
      }>
    ) {
      if (state.conversationId == action.payload.conversationId) {
        state.isBlockedByMe =
          action.payload.isBlockedByMe ?? state.isBlockedByMe;
        state.hasBlockedMe = action.payload.hasBlockedMe ?? state.hasBlockedMe;
      }
    },

    updateBlockGroupStatus(
      state,
      action: PayloadAction<{ conversationId: string; isBlocked: boolean }>
    ) {
      if (state.conversationId == action.payload.conversationId) {
        state.isBlocked = action.payload.isBlocked;
      }
    },
  },
});

export const {
  setActiveReceiver,
  clearActiveReceiver,
  setActiveReceiverConversationId,
  setTypingStatus,
  updateActiveReceiver,
  updateBlockUserStatus,
  updateBlockGroupStatus
} = activeReceiverSlice.actions;
export default activeReceiverSlice.reducer;
