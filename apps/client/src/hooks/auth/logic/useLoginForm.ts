import axios from 'axios';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import {
  clearError,
  setError,
} from '@client/redux/features/userSlices/authSlices/errorSlice';
import { useLogin } from '../api/useLogin';
import { setUser } from '@client/redux/features/userSlices/authSlices/userSlice';

export const useLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isPending, isSuccess, isError, mutate, error, data } = useLogin();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearError());
      dispatch(setUser({ user: data.user }));
      if (data.user.role == 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
        window.location.reload();
      }
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(error.response?.data?.message || 'Somthing went wrong')
        );
      } else {
        dispatch(setError(error.message || 'Somthing went wrong'));
      }
    }
  }, [isError, error, dispatch]);

  return { mutate };
};
