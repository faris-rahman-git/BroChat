import { logoutApi } from '@client/services/auth/authServices';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi,
  });
};
