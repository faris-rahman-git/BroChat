import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { Receiver } from '@client/types/ReduxTypes';
import { useEffect } from 'react';
import { useUnBlockUser } from '../api/useUnBlockUser';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { updateBlockedUser } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { updateBlockUserStatus } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';

export const useUnBlockUserForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate } = useUnBlockUser();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        updateBlockedUser({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: false,
        })
      );
      dispatch(
        updateBlockUserStatus({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: false,
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    unBlockUserMutate: mutate,
  };
};
