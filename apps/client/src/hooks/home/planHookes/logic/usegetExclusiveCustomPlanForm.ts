import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { usegetExclusiveCustomPlan } from '../api/usegetExclusiveCustomPlan';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { PlanType } from '@bro/shared';

export const usegetExclusiveCustomPlanForm = (
  setExclusivePlan: React.Dispatch<React.SetStateAction<PlanType | null>>
) => {
  const dispatch = useAppDispatch();
  const { isPending, isSuccess, mutate, data } = usegetExclusiveCustomPlan();

  useEffect(() => {
    if (isSuccess) {
      setExclusivePlan(data.planList);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  return {
    getExclusiveCustomPlanMutate: mutate,
  };
};
