import { hardDeleteGroupApi } from '@client/services/admin/groupService';
import { useMutation } from '@tanstack/react-query';

export const useHardDeleteGroup = () => {
  return useMutation({
    mutationFn: hardDeleteGroupApi,
  });
};
