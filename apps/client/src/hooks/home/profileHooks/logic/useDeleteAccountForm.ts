import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useDeleteAccount } from '../api/useDeleteAccount';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useDeleteAccountForm = (logOut: () => void) => {
  const dispatch = useAppDispatch();

  const { mutate, isPending, isSuccess } = useDeleteAccount();

  useEffect(() => {
    if (isSuccess) {
      logOut();
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    deleteAccountMutate: mutate,
  };
};
