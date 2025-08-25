import { useSoftDeleteUser } from '../api/useSoftDeleteUser';
import { AllUsersType } from '@bro/shared';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useSoftDeleteUserForm = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useSoftDeleteUser();

  useEffect(() => {
    if (isSuccess) {
      setUserList(data.updatedUsersList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  //error handles

  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutateSoftDelete: mutate,
  };
};
