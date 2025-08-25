import axios from 'axios';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { clearRegisterData } from '@client/redux/features/userSlices/authSlices/authSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { useOtpAndPassword } from '../api/useOtpAndPassword';

export const useOtpAndPasswordForm = (mode: string | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isPending, isSuccess, isError, mutate, error } = useOtpAndPassword();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      if (mode === 'register') {
        dispatch(setError('Account created successfully! '));
      } else {
        dispatch(setError('Password changed successfully! '));
      }
      dispatch(clearRegisterData());
      navigate('/login');
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
