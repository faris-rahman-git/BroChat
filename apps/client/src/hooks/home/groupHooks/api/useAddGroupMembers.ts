import { addGroupMembersApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useAddGroupMembers = () => {
  return useMutation({
    mutationFn: addGroupMembersApi,
  });
};