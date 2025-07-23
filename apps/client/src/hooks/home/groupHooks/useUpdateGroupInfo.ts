import { updateGroupInfoApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useUpdateGroupInfo = () => {
  return useMutation({
    mutationFn: updateGroupInfoApi,
  });
};
