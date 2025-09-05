import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useCallAccept } from '../api/useCallAccept';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useCallAcceptForm = () => {
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useCallAccept();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
    return () => {
      dispatch(hideLoader());
    };
  }, [isPending]);

  return {
    callAcceptMutate: mutate,
  };
};
