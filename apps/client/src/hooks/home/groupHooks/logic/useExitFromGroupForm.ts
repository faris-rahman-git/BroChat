import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { Receiver } from '@client/types/ReduxTypes';
import { useEffect } from 'react';
import { useExitFromGroup } from '../api/useExitFromGroup';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { removeGroupChat } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { clearActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';

export const useExitFromGroupForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess } = useExitFromGroup();

  useEffect(() => {
    if (isSuccess) {
      dispatch(removeGroupChat(receiverDetails.conversationId!));
      dispatch(clearActiveReceiver(receiverDetails.conversationId!));
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    exitMutate: mutate,
  };
};
