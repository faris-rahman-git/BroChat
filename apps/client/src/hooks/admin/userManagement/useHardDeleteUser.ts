import { hardDeleteUserApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useHardDeleteUser = () => {
  return useMutation({
    mutationFn: hardDeleteUserApi,
  });
};
