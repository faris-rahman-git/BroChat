import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect, useState } from 'react';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { useResendotp } from '../api/useResentOtp';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';

export const useResendotpForm = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const dispatch = useAppDispatch();
  const { isPending, isSuccess, isError, mutate } = useResendotp();

  const userBasicData = useSelector((state: RootState) => state.auth.email);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setError('OTP Resent Successfully!'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      dispatch(setError('OTP Resent Failed! Please Try Again'));
    }
  }, [isError]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDisabled && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isDisabled]);

  const handleResentOtp = () => {
    if (userBasicData && !isDisabled) {
      mutate(userBasicData);
      setIsDisabled(true);
      setTimeLeft(60);
    }
  };

  return { handleResentOtp , timeLeft , isDisabled };
};
