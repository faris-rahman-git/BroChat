import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useGroupSoftDeleteManagement } from '../api/useGroupSoftDeleteManagement';

export const useGroupSoftDeleteManagementForm = (
  setGroupList: (data: any[]) => void,
  setTotalPages: (totalPages: number) => void
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useGroupSoftDeleteManagement();

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
    mutateSoftDelete: mutate,
  };
};
