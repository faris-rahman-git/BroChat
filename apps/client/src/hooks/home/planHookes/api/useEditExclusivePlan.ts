import { editExclusivePlanApi } from '@client/services/home/planService';
import { useMutation } from '@tanstack/react-query';

export const useEditExclusivePlan = () => {
  return useMutation({
    mutationFn: editExclusivePlanApi,
  });
};
