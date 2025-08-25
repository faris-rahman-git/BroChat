import { updateProfileInfoApi } from '@client/services/home/profileService';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProfileInfo = () => {
  return useMutation({
    mutationFn: updateProfileInfoApi,
  });
};
