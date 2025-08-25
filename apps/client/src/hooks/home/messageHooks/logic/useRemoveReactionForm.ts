import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect } from 'react';
import { useRemoveReaction } from '../api/useRemoveReaction';
import { removeReaction } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';

export const useRemoveReactionForm = (
  conversationId: string,
  messageId: string,
  userId: string
) => {
  const dispatch = useAppDispatch();

  const { mutate, isSuccess } = useRemoveReaction();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        removeReaction({
          conversationId,
          messageId,
          userId,
        })
      );
    }
  }, [isSuccess]);

  return {
    removeMutate: mutate,
  };
};
