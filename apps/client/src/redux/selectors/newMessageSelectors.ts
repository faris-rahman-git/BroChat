import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectNewMessagesByConversation = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.newMessages.messagesByConversation,
    (messagesByConversation) => messagesByConversation[conversationId] || []
  );
