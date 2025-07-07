import { restoreUserApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useRestoreUser = () => {
  return useMutation({
    mutationFn: restoreUserApi,
  });
};
