import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { usePrevMessages } from '../api/usePrevMessages';
import { useEffect } from 'react';
import { setMessagesForConversation } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

export const usePrevMessagesForm = (activeChatId: string) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, isSuccess, mutate, data, error } =
    usePrevMessages();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setMessagesForConversation({
          conversationId: activeChatId,
          messages: data.messages,
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log('Error: ', error);
    }
  }, [isError]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    prevMutate: mutate,
  };
};
