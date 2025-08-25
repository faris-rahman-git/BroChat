import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useBlockUser } from '../api/useBlockUser';
import { updateBlockedUser } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { updateBlockUserStatus } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { Receiver } from '@client/types/ReduxTypes';

export const useBlockUserForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const {
    isPending,
    isSuccess,
    mutate,
  } = useBlockUser();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        updateBlockedUser({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: true,
        })
      );
      dispatch(
        updateBlockUserStatus({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: true,
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    blockUserMutate: mutate,
  };
};
