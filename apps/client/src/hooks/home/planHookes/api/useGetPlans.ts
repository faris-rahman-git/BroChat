import { getAllPlansApi } from '@client/services/home/planService';
import { useMutation } from '@tanstack/react-query';

export const useGetPlans = () => {
  return useMutation({
    mutationFn: getAllPlansApi,
  });
};
