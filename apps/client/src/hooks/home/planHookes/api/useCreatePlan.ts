import { createPlanApi } from '@client/services/home/planService';
import { useMutation } from '@tanstack/react-query';

export const useCreatePlan = () => {
  return useMutation({
    mutationFn: createPlanApi,
  });
};
