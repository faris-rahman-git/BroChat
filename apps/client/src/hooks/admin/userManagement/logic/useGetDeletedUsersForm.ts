import { useEffect } from 'react';
import { useGetDeletedUsers } from '../api/useGetDeletedUsers';
import { AllUsersType } from '@bro/shared';

export const useGetDeletedUsersForm = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetDeletedUsers();

  useEffect(() => {
    if (isSuccess) {
      setUserList(data.usersList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error?.message) {
      console.log(error.message);
    }
  }, [isError]);

  return {
    isPending,
    getDeleteUsersMutate: mutate,
  };
};
