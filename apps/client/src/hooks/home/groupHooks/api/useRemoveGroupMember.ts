import { removeGroupMemberApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useRemoveGroupMember = () => {
  return useMutation({
    mutationFn: removeGroupMemberApi,
  });
};
