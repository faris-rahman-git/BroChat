import { deleteAccountApi } from '@client/services/home/profileService';
import { useMutation } from '@tanstack/react-query';

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccountApi,
  });
};
