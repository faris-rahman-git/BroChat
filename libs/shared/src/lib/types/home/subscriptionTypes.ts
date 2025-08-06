export type subscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionDetailsType = {
  isSubscribed: boolean;
  subscriptionPlan: subscriptionPlan | null;
  subscriptionStart: string | null | Date;
  subscriptionEnd: string | null | Date;
};
