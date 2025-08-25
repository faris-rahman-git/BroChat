import api from '@client/configs/axios';
import { ExclusivePlanType, PaymentType } from '@bro/shared';
const PLAN_API = '/user/plan';

export const getAllPlansApi = async (selectedChild: PaymentType) => {
  const res = await api.get(PLAN_API + '/getAllPlans' + '/' + selectedChild);
  return res.data;
};

export const getExclusiveCustomPlanApi = async (userId: string) => {
  const res = await api.get(PLAN_API + '/getExclusiveCustomPlan' + '/' + userId);
  return res.data;
};

export const createPlanApi = async (data: ExclusivePlanType) => {
  const res = await api.post(PLAN_API + '/createplan', data);
  return res.data;
};

export const editExclusivePlanApi = async (
  data: ExclusivePlanType & { _id: string }
) => {
  const res = await api.put(PLAN_API + '/editExclusivePlan', data);
  return res.data;
};
