import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallInvite } from '../api/useCallInvite';

export const useCallInviteForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess, data } = useCallInvite();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);


  useEffect(() => {
    if (isSuccess) {
      navigate(data?.callUrl);
    }
  }, [isSuccess]);

  return {
    mutateCallInvite: mutate,
  };
};
