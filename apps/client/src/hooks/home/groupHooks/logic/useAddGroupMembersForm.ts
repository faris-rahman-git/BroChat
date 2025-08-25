import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect } from 'react';
import { useAddGroupMembers } from '../api/useAddGroupMembers';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

export const useAddGroupMembersForm = () => {
  const dispatch = useAppDispatch();
  const { isPending, mutate } = useAddGroupMembers();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutate,
  };
};
