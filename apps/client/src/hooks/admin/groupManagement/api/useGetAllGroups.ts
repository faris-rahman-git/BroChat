import { getAllGroupsApi } from '@client/services/admin/groupService';
import { useMutation } from '@tanstack/react-query';

export const useGetAllGroups = () => {
  return useMutation({
    mutationFn: getAllGroupsApi,
  });
};
