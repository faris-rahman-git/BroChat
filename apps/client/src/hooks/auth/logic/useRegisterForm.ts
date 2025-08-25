import axios from 'axios';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../api/useRegister';
import { useEffect } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { clearRegisterData } from '@client/redux/features/userSlices/authSlices/authSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';

export const useRegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, isError, mutate, error } = useRegister();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setError('Please check your email For OTP'));
      navigate('/otpandpassword?mode=register');
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
