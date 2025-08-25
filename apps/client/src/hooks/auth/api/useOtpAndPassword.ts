import { otpAndPasswordApi } from '@client/services/auth/authServices';
import { useMutation } from '@tanstack/react-query';

export const useOtpAndPassword = () => {
  return useMutation({
    mutationFn: otpAndPasswordApi,
  });
};
