import { getDeletedGroupsApi } from '@client/services/admin/groupService';
import { useMutation } from '@tanstack/react-query';

export const useGetDeletedGroups = () => {
  return useMutation({
    mutationFn: getDeletedGroupsApi,
  });
};
