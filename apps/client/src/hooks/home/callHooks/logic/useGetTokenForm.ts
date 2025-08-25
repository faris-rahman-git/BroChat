import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useGetToken } from '../api/useGetToken';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';

export const useGetTokenForm = () => {
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess, data, error } = useGetToken();

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  return {
    mutate,
    isSuccess,
    data,
    error,
  };
};
