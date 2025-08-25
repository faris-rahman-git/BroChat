import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect } from 'react';
import { useOneToOneChatList } from '../api/useOneToOneChatList';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setChatList } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';

export const useOneToOneChatListForm = () => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, isError, mutate, error, data } =
    useOneToOneChatList();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setChatList(data.usersList));
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
    oneToOneMutate: mutate,
  };
};
