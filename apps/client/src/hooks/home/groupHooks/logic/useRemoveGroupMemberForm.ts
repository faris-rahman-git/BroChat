import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { dismissGroupAdmin, removeGroupMember } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { Receiver } from '@client/types/ReduxTypes';
import { useEffect } from 'react';
import { useRemoveGroupMember } from '../api/useRemoveGroupMember';

export const useRemoveGroupMemberForm = (receiverDetails: Receiver) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useRemoveGroupMember();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        removeGroupMember({
          conversationId: receiverDetails.conversationId!,
          memberId: data.memberId,
        })
      );
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
    removeMemberMutate: mutate,
  };
};
