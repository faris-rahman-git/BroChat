import { getAllUsersApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useGetAllUsers = () => {
  return useMutation({
    mutationFn: getAllUsersApi,
  });
};
