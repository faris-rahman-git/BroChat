import { userBlockManagementApi } from '@client/services/adminServices';
import { useMutation } from '@tanstack/react-query';

export const useUserBlockManagement = () => {
  return useMutation({
    mutationFn: userBlockManagementApi,
  });
};
