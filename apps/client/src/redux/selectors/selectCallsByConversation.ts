import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectCallsByConversation = createSelector(
  [
    (state: RootState) => state.callList.callList,
    (_: RootState, conversationId: string) => conversationId,
  ],
  (callList, conversationId) => {
    return callList.filter((call) => call.conversationId === conversationId);
  }
);
