import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { PlanType } from '@bro/shared';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useGetPlans } from '../api/useGetPlans';

export const useGetPlansForm = (
  setExclusivePlan:
    | React.Dispatch<React.SetStateAction<PlanType | null>>
    | React.Dispatch<React.SetStateAction<PlanType[]>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useGetPlans();

  useEffect(() => {
    if (isSuccess) {
      setExclusivePlan(data.planList);
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    getPlanMutate: mutate,
  };
};
