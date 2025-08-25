import { useEffect } from 'react';
import { useUserBlockManagement } from '../api/useUserBlockManagement';
import { AllUsersType } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useUserBlockManagementForm = (
  setUserList: React.Dispatch<React.SetStateAction<AllUsersType[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error, data } =
    useUserBlockManagement();

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
    mutateBlock: mutate,
  };
};
