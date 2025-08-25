import { hardDeleteUserApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useHardDeleteUser = () => {
  return useMutation({
    mutationFn: hardDeleteUserApi,
  });
};
