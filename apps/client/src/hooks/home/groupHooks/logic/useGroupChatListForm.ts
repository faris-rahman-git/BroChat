import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useGroupChatList } from '../api/useGroupChatList';
import { setGroupChatList } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';

export const useGroupChatListForm = () => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, isError, mutate, error, data } =
    useGroupChatList();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setGroupChatList(data.groupList));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    groupMutate: mutate,
  };
};
