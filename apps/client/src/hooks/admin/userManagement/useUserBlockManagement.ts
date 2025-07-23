import { userBlockManagementApi } from '@client/services/admin/userServices';
import { useMutation } from '@tanstack/react-query';

export const useUserBlockManagement = () => {
  return useMutation({
    mutationFn: userBlockManagementApi,
  });
};
