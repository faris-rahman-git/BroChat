import { getAllPlansApi } from '@client/services/admin/planService';
import { useMutation } from '@tanstack/react-query';

export const useGetAllPlans = () => {
  return useMutation({
    mutationFn: getAllPlansApi,
  });
};
