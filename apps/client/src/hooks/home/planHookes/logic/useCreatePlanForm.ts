import { useEffect } from 'react';
import { useCreatePlan } from '../api/useCreatePlan';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { updateIsExclusiveStatus } from '@client/redux/features/userSlices/authSlices/userSlice';
import { PlanType } from '@bro/shared';

export const useCreatePlanForm = (
  setExclusivePlanKid: (plan: PlanType | null) => void,
  setShowThankYouModal: () => void,
  onClose: () => void
) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, data, mutate, error } = useCreatePlan();

  useEffect(() => {
    if (isSuccess) {
      setExclusivePlanKid(data.planList);
      dispatch(updateIsExclusiveStatus({ isExclusive: true }));
      setShowThankYouModal();
      onClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    createPlanMutate: mutate,
    createPlanError: error,
  };
};
