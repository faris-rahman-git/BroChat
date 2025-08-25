import { useEffect } from 'react';
import { useGetDeletedGroups } from '../api/useGetDeletedGroups';
import { DeleteGroupsReturnType } from '@bro/shared';

export const useGetDeletedGroupsForm = (
  setGroupList: (data: DeleteGroupsReturnType[]) => void,
  setTotalPages: (totalPages: number) => void
) => {
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetDeletedGroups();

  useEffect(() => {
    if (isSuccess) {
      setGroupList(data.groupList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError && error?.message) {
      console.log(error.message);
    }
  }, [isError, error]);

  return {
    getDeleteGroup: mutate,
    isPending,
  };
};
