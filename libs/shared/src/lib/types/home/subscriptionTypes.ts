
export type SubscriptionDetailsType = {
  isSubscribed: boolean;
  subscriptionPlan: string | null;
  subscriptionStart: string | null | Date;
  subscriptionEnd: string | null | Date;
};
