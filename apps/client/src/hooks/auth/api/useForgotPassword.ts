import { forgotPasswordApi } from '@client/services/auth/authServices';
import { useMutation } from '@tanstack/react-query';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};
