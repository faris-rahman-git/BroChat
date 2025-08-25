import axios from 'axios';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { useForgotPassword } from '../api/useForgotPassword';
import { clearRegisterData } from '@client/redux/features/userSlices/authSlices/authSlice';

export const useForgotPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, isError, mutate, error } = useForgotPassword();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setError('Please check your email For OTP'));
      navigate('/otpandpassword?mode=forgot');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      dispatch(clearRegisterData());
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
