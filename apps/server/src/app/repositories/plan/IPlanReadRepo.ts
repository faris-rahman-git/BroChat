import { PaymentType, PlanType } from '@bro/shared';

export interface IPlanReadRepo {
  findPlans(selectedChild: PaymentType): Promise<PlanType[]>;

  findExclusiveUserCustomer(userId: string): Promise<PlanType | null>;
}
