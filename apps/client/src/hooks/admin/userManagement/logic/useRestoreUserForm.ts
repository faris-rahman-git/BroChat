import { AllUsersType } from '@bro/shared';
import { useEffect } from 'react';
import { useRestoreUser } from '../api/useRestoreUser';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useRestoreUserForm = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useRestoreUser();

  useEffect(() => {
    if (isSuccess) {
      setUserList(data.updatedUsersList);
      setTotalPages(data.totalPages);
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
    mutateRestore: mutate,
  };
};
