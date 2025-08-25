import { getDeletedUsersApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useGetDeletedUsers = () => {
  return useMutation({
    mutationFn: getDeletedUsersApi,
  });
};
