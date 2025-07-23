import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '../../services/auth/authServices';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};
