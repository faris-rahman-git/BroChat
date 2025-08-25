import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useCallReject } from '../api/useCallReject';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useCallRejectForm = () => {
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useCallReject();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    callRejectMutate: mutate,
  };
};
