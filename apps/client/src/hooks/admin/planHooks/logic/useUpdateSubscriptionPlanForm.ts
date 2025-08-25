import { PlanType } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useUpdateSubscriptionPlan } from '../api/useUpdateSubscriptionPlan';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useUpdateSubscriptionPlanForm = (
  setPlans: (data: PlanType[]) => void
) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useUpdateSubscriptionPlan();

  useEffect(() => {
    if (isSuccess) {
      setPlans(data.planList);
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutateUpdatePlan: mutate,
  };
};
