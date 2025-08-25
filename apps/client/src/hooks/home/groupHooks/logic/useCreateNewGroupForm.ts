import { useEffect } from 'react';
import { useCreateNewGroup } from '../api/useCreateNewGroup';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import React from 'react';

export const useCreateNewGroupForm = (
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isError, mutate, isSuccess, error } = useCreateNewGroup();

  useEffect(() => {
    if (isSuccess) {
      setActiveTab('');
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
    newMutate: mutate,
  };
};
