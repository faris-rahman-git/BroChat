import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { Receiver } from '@client/types/ReduxTypes';
import { useEffect } from 'react';
import { useDismissGroupAdmin } from '../api/useDismissGroupAdmin';
import { dismissGroupAdmin } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';

export const useDismissGroupAdminForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useDismissGroupAdmin();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        dismissGroupAdmin({
          conversationId: receiverDetails.conversationId!,
          memberId: data.memberId,
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    dismissAdminMutate: mutate,
  };
};
