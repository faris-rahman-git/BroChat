import { getAllUsersApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useGetAllUsers = () => {
  return useMutation({
    mutationFn: getAllUsersApi,
  });
};
