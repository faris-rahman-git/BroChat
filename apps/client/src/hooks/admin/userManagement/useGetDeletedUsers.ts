import { getDeletedUsersApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useGetDeletedUsers = () => {
  return useMutation({
    mutationFn: getDeletedUsersApi,
  });
};
