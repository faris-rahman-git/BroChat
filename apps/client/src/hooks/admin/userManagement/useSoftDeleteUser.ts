import { softDeleteUserApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useSoftDeleteUser = () => {
  return useMutation({
    mutationFn: softDeleteUserApi,
  });
};
