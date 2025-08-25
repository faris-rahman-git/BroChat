import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useGroupBlockManagement } from '../api/useGroupBlockManagement';
import { GroupChatType } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

export const useGroupBlockManagementForm = (
  setGroupList: (data: GroupChatType[]) => void,
  setTotalPages: (totalPages: number) => void
) => {
  const dispatch = useAppDispatch();

  const {
    isPending,
    isError: isError,
    mutate,
    isSuccess: isSuccessBlock,
    error: errorBlock,
    data: dataBlock,
  } = useGroupBlockManagement();

  useEffect(() => {
    if (isSuccessBlock) {
      setGroupList(dataBlock.updatedGroupList);
      setTotalPages(dataBlock.totalPages);
    }
  }, [isSuccessBlock]);

  useEffect(() => {
    if (isError) {
      console.log(errorBlock.message);
    }
  }, [isError]);

  useEffect(() => {
    const anyPending = isPending;
    dispatch(anyPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutateBlock: mutate,
  };
};
