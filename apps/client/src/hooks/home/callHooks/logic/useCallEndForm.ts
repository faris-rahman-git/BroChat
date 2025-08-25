import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useCallEnd } from '../api/useCallEnd';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';

export const useCallEndForm = () => {
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useCallEnd();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    callEndMutate: mutate,
  };
};
