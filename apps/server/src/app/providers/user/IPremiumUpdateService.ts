import { SubscriptionDetailsType } from '@bro/shared';

export interface IPremiumUpdateService {
  updatePremiumGroup(conversationId: string, userId: string): Promise<void>;
  updateSubscription(
    userId: string,
    {
      isSubscribed,
      subscriptionPlan,
      subscriptionStart,
      subscriptionEnd,
    }: SubscriptionDetailsType
  ): Promise<void>;

  exclusiveUserUpdate(userId: string): Promise<void>;

  exclusiveUserCustomerUpdate(
    paymentId: string,
    orderId: string,
    userId: string,
    amount: number
  ): Promise<void>;
}
