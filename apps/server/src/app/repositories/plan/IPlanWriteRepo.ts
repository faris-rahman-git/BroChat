import { ExclusivePlanType, PlanType } from '@bro/shared';

export interface IPlanWriteRepo {
  saveNewSubscriptionPlan(
    data: Omit<PlanType, '_id' | 'createdAt'>
  ): Promise<void>;

  updatePlan(data: Omit<PlanType, 'createdAt'>): Promise<void>;

  createNewExclusiveUserCustomerPlan(
    data: ExclusivePlanType,
    userId: string
  ): Promise<void>;

  updateExclusiveCustomerPlan(data: ExclusivePlanType & { _id: string }): Promise<void>;
}
