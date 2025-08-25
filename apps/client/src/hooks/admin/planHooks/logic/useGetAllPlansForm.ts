import { useEffect } from 'react';
import { useGetAllPlans } from '../api/useGetAllPlans';
import { PlanType } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useGetAllPlansForm = (setPlans: (data: PlanType[]) => void) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useGetAllPlans();

  useEffect(() => {
    if (isSuccess) {
      setPlans(data.planList);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutatePlans: mutate,
    isPending,
  };
};
