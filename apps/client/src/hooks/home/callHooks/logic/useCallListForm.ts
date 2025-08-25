import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useCallList } from '../api/useCallList';
import { setCallList } from '@client/redux/features/userSlices/homeSlices/callSlices/callListSlice';

export const useCallListForm = () => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useCallList();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCallList(data.callList));
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    callMutate: mutate,
  };
};
