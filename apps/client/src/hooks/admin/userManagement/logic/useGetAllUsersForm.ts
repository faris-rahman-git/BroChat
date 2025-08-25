import { useEffect } from 'react';
import { useGetAllUsers } from '../api/useGetAllUsers';
import { AllUsersType } from '@bro/shared';

export const useGetAllUsersForm = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetAllUsers();

  useEffect(() => {
    if (isSuccess) {
      setUserList(data.usersList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  return {
    getAllUserMutate: mutate,
    isPending,
  };
};
