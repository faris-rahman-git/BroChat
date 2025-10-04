import api from '@client/configs/axios';
import { PaymentType, PlanSchemaType } from '@bro/shared';
const PLAN_API = '/user/plan';

export const getAllPlansApi = async (selectedChild: PaymentType) => {
  const res = await api.get(PLAN_API + '/getAllPlans' + '/' + selectedChild);
  return res.data;
};

export const getExclusiveCustomPlanApi = async (userId: string) => {
  const res = await api.get(
    PLAN_API + '/getExclusiveCustomPlan' + '/' + userId
  );
  return res.data;
};

export const createPlanApi = async (data: PlanSchemaType) => {
  const res = await api.post(PLAN_API + '/createplan', data);
  return res.data;
};

export const editExclusivePlanApi = async ({
  data,
  exclusivePlanId,
}: {
  data: PlanSchemaType;
  exclusivePlanId: string;
}) => {
  const res = await api.put(
    PLAN_API + '/editExclusivePlan/' + exclusivePlanId,
    data
  );
  return res.data;
};
