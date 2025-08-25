import { useEffect } from 'react';
import { useAddReaction } from '../api/useAddReaction';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { addReaction } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';

export const useAddReactionForm = (
  conversationId: string,
  messageId: string
) => {
  const dispatch = useAppDispatch();

  const { isSuccess, mutate, data } = useAddReaction();

  useEffect(() => {
    if (isSuccess) {
      dispatch(addReaction({ conversationId, messageId, reaction: data }));
    }
  }, [isSuccess]);

  return {
    addReactionMutate: mutate,
  };
};
