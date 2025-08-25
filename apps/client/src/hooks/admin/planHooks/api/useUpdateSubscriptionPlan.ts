import { updatePlanApi } from '@client/services/admin/planService';
import { useMutation } from '@tanstack/react-query';

export const useUpdateSubscriptionPlan = () => {
  return useMutation({
    mutationFn: updatePlanApi,
  });
};
