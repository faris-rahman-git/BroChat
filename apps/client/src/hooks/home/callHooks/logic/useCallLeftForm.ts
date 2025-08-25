import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useCallLeft } from '../api/useCallLeft';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

export const useCallLeftForm = () => {
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useCallLeft();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    callLeftMutate: mutate,
  };
};
