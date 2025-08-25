import api from '@client/configs/axios';
import { PlanType } from '@bro/shared';
const PLAN_API = '/admin/planManagement';

export const getAllPlansApi = async (selectedChild: string) => {
  const res = await api.get(PLAN_API + '/getallplans' + '/' + selectedChild);
  return res.data;
};

export const saveNewSubscriptionPlanApi = async (
  data: Omit<PlanType, '_id' | 'createdAt'>
) => {
  const res = await api.post(PLAN_API + '/savenewsubscriptionplan', data);
  return res.data;
};

export const updatePlanApi = async ({
  data,
  selectedChild,
}: {
  selectedChild: string;
  data: Omit<PlanType, 'createdAt'> & {
    _id: string;
  };
}) => {
  const res = await api.put(
    PLAN_API + '/updateplan' + '/' + selectedChild,
    data
  );
  return res.data;
};
