import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { Receiver } from '@client/types/ReduxTypes';
import { useEffect } from 'react';
import { useMakeGroupAdmin } from '../api/useMakeGroupAdmin';
import { makeGroupAdmin } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';

export const useMakeGroupAdminForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useMakeGroupAdmin();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        makeGroupAdmin({
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
    makeAdminMutate: mutate,
  };
};
