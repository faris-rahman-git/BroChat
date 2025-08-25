import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { AllUsersType } from '@bro/shared';
import { useHardDeleteUser } from '../api/useHardDeleteUser';

export const useHardDeleteUserHook = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useHardDeleteUser();

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
    mutateHardDelete: mutate,
  };
};
