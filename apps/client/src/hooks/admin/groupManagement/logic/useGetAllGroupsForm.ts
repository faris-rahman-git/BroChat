import {  useEffect } from 'react';
import { useGetAllGroups } from '../api/useGetAllGroups';
import { GroupChatType } from '@bro/shared';

export const useGetAllGroupsForm = (
  setGroupList: (data: GroupChatType[]) => void,
  setTotalPages: (totalPages: number) => void
) => {
  //main data handler
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetAllGroups();
  useEffect(() => {
    if (isSuccess) {
      setGroupList(data.groupList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  return {
    getAllGroupMutate : mutate,
    isPending
  };
};
