// store/slices/groupChatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GroupChatListType,
  GroupMember,
  updateGroupInfoType,
} from '@bro/shared';

type GroupChatState = {
  groupList: GroupChatListType[];
};

const initialState: GroupChatState = {
  groupList: [],
};

const groupChatSlice = createSlice({
  name: 'groupChat',
  initialState,
  reducers: {
    setGroupChatList(state, action: PayloadAction<GroupChatListType[]>) {
      state.groupList = action.payload;
    },
    addGroupIfNotExists(state, action: PayloadAction<GroupChatListType>) {
      const exists = state.groupList.some(
        (group) => group._id === action.payload._id
      );
      if (!exists) {
        state.groupList.unshift(action.payload);
      }
    },
    deleteMessage(state, action: PayloadAction<string>) {
      state.groupList = state.groupList.filter(
        (group) => group._id !== action.payload
      );
    },
    changeGroupChatToTop(
      state,
      action: PayloadAction<{ conversationId: string }>
    ) {
      const index = state.groupList.findIndex(
        (grp) => grp._id === action.payload.conversationId
      );

      if (index !== -1) {
        const chat = state.groupList.splice(index, 1)[0];
        state.groupList.unshift(chat);
      }
    },
    removeGroupChat(state, action: PayloadAction<string>) {
      state.groupList = state.groupList.filter(
        (group) => group._id !== action.payload
      );
    },

    removeGroupMember(
      state,
      action: PayloadAction<{ conversationId: string; memberId: string }>
    ) {
      const group = state.groupList.find(
        (group) => group._id === action.payload.conversationId
      );
      if (group) {
        group.participants = group.participants.filter(
          (member) => member._id !== action.payload.memberId
        );
      }
    },
    makeGroupAdmin(
      state,
      action: PayloadAction<{ conversationId: string; memberId: string }>
    ) {
      const group = state.groupList.find(
        (group) => group._id === action.payload.conversationId
      );
      if (group) {
        group.Admins.push(action.payload.memberId);
      }
    },

    dismissGroupAdmin(
      state,
      action: PayloadAction<{ conversationId: string; memberId: string }>
    ) {
      const group = state.groupList.find(
        (group) => group._id === action.payload.conversationId
      );
      if (group) {
        group.Admins = group.Admins.filter(
          (id) => id !== action.payload.memberId
        );
      }
    },
    addGroupMembers(
      state,
      action: PayloadAction<{
        conversationId: string;
        newMemberDetails: GroupMember[];
      }>
    ) {
      const group = state.groupList.find(
        (group) => group._id === action.payload.conversationId
      );
      if (group) {
        group.participants.push(...action.payload.newMemberDetails);
      }
    },

    updateGroupInfo(
      state,
      action: PayloadAction<{
        conversationId: string;
        groupInfo: updateGroupInfoType;
      }>
    ) {
      const index = state.groupList.findIndex(
        (group) => group._id === action.payload.conversationId
      );
      if (index !== -1) {
        state.groupList[index] = {
          ...state.groupList[index],
          ...action.payload.groupInfo,
        };
      }
    },
  },
});

export const {
  setGroupChatList,
  addGroupIfNotExists,
  changeGroupChatToTop,
  removeGroupChat,
  removeGroupMember,
  makeGroupAdmin,
  dismissGroupAdmin,
  addGroupMembers,
  updateGroupInfo,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;
