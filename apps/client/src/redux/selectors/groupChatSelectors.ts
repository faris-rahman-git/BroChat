import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectGroupChatById = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.groupChat.groupList,
    (groupList) => groupList.find((group) => group._id === conversationId)
  );
