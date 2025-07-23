import { restoreUserApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useRestoreUser = () => {
  return useMutation({
    mutationFn: restoreUserApi,
  });
};
