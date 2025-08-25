import { useEffect } from 'react';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useSaveNewSubscriptionPlan } from '../api/useSaveNewSubscriptionPlan';
import { PlanType } from '@bro/shared';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useSaveNewSubscriptionPlanForm = (
  setPlans: (data: PlanType[]) => void
) => {
  const dispatch = useAppDispatch();

  const {
    isPending,
    isSuccess,
    mutate: mutateNewPlan,
    data: dataNewPlan,
  } = useSaveNewSubscriptionPlan();

  useEffect(() => {
    if (isSuccess) {
      setPlans(dataNewPlan.planList);
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return { mutateNewPlan };
};
