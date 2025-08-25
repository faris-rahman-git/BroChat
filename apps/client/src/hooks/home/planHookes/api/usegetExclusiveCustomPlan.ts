import { getExclusiveCustomPlanApi } from '@client/services/home/planService';
import { useMutation } from '@tanstack/react-query';

export const usegetExclusiveCustomPlan = () => {
  return useMutation({
    mutationFn: getExclusiveCustomPlanApi,
  });
};
