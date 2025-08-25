import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { DeleteGroupsReturnType } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useHardDeleteGroup } from '../api/useHardDeleteGroup';

export const useHardDeleteGroupForm = (
  setGroupList: (data: DeleteGroupsReturnType[]) => void,
  setTotalPages: (totalPages: number) => void
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useHardDeleteGroup();

  useEffect(() => {
    if (isSuccess) {
      setGroupList(data.updatedGroupList);
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
