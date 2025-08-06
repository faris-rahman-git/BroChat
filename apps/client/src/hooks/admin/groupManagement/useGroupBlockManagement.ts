import { groupBlockManagementApi } from '@client/services/admin/groupService';
import { useMutation } from '@tanstack/react-query';

export const useGroupBlockManagement = () => {
  return useMutation({
    mutationFn: groupBlockManagementApi,
  });
};
