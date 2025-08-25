import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect } from 'react';
import { useUpdateGroupInfo } from '../api/useUpdateGroupInfo';
import { updateGroupInfo } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { updateActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { Receiver } from '@client/types/ReduxTypes';

export const useUpdateGroupInfoForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { mutate, isPending, isSuccess, data } = useUpdateGroupInfo();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        updateGroupInfo({
          conversationId: receiverDetails.conversationId!,
          groupInfo: data.groupInfo,
        })
      );
      dispatch(
        updateActiveReceiver({
          conversationId: receiverDetails.conversationId!,
          groupInfo: data.groupInfo,
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    updateGroupInfoMutate: mutate,
  };
};
