import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResultType } from '@bro/shared';

type ChatState = {
  chatList: SearchResultType[];
};

const initialState: ChatState = {
  chatList: [],
};

const oneToOneChatSlice = createSlice({
  name: 'oneToOneChat',
  initialState,
  reducers: {
    setChatList(state, action: PayloadAction<SearchResultType[]>) {
      state.chatList = action.payload;
    },
    setUserOnlineStatus(
      state,
      action: PayloadAction<{ userId: string; status: boolean }>
    ) {
      state.chatList = state.chatList.map((user) =>
        user.receiverId === action.payload.userId
          ? { ...user, isOnline: action.payload.status }
          : user
      );
    },
    setUserTypingStatus(
      state,
      action: PayloadAction<{ senderId: string; status: boolean }>
    ) {
      state.chatList = state.chatList.map((user) =>
        user.receiverId === action.payload.senderId
          ? { ...user, isTyping: action.payload.status }
          : user
      );
    },
    addUserIfNotExists(state, action: PayloadAction<SearchResultType>) {
      const exists = state.chatList.some(
        (user) => user.receiverId === action.payload.receiverId
      );
      if (!exists) {
        state.chatList.unshift(action.payload);
      }
    },

    changeChatToTop(state, action: PayloadAction<{ conversationId: string }>) {
      const index = state.chatList.findIndex(
        (user) => user.conversationId === action.payload.conversationId
      );

      if (index !== -1) {
        const chat = state.chatList.splice(index, 1)[0];
        state.chatList.unshift(chat);
      }
    },

    updateBlockedUser(
      state,
      action: PayloadAction<{
        conversationId: string;
        isBlockedByMe?: boolean;
        hasBlockedMe?: boolean;
      }>
    ) {
      const { conversationId, isBlockedByMe, hasBlockedMe } = action.payload;

      const user = state.chatList.find(
        (user) => user.conversationId === conversationId
      );

      if (user) {
        user.isBlockedByMe = isBlockedByMe ?? user.isBlockedByMe;
        user.hasBlockedMe = hasBlockedMe ?? user.hasBlockedMe;
      }
    },
  },
});

export const {
  setChatList,
  setUserOnlineStatus,
  setUserTypingStatus,
  addUserIfNotExists,
  changeChatToTop,
  updateBlockedUser,
} = oneToOneChatSlice.actions;

export default oneToOneChatSlice.reducer;
