import { saveNewSubscriptionPlanApi } from '@client/services/admin/planService';
import { useMutation } from '@tanstack/react-query';

export const useSaveNewSubscriptionPlan = () => {
  return useMutation({
    mutationFn: saveNewSubscriptionPlanApi,
  });
};
