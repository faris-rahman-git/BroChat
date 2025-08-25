import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useLogout } from '../api/useLogout';
import { logout } from '@client/redux/features/userSlices/authSlices/userSlice';

export const useLogoutForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, mutate } = useLogout();

  useEffect(() => {
    const isLoading = isPending;
    dispatch(isLoading ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  return { appLogout: mutate };
};
