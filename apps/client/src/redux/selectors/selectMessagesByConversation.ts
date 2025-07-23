import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectMessagesByConversation = createSelector(
  [
    (state: RootState) => state.messageHistory,
    (_: RootState, conversationId: string) => conversationId,
  ],
  (messageHistory, conversationId) => {
    return messageHistory[conversationId] ?? [];
  }
);
