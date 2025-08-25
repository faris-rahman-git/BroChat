import { groupSoftDeleteManagementApi } from '@client/services/admin/groupService';
import { useMutation } from '@tanstack/react-query';

export const useGroupSoftDeleteManagement = () => {
  return useMutation({
    mutationFn: groupSoftDeleteManagementApi,
  });
};
