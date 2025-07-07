import { softDeleteUserApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useSoftDeleteUser = () => {
  return useMutation({
    mutationFn: softDeleteUserApi,
  });
};
