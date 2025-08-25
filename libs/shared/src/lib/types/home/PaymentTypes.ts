import { GroupMember } from './groupTypes.js';

export type PaymentType =
  | 'subscription'
  | 'paid_group'
  | 'exclusive_user'
  | 'exclusive_user_customer';

export type VerifyInType = {
  paymentId: string;
  orderId: string;
  signature: string;
  feature: PaymentType;
  userId?: string;
  conversationId?: string;
  amount: number;
  recipientName: string;
  recipientEmail: string;
  planName?: string;
  duration?: number;
  exclusiveUserId?: string;
};

export type findAllExclusiveUserCustomersTransactionsType = {
  userDetails:GroupMember;
  amount: number;
  createdAt: Date
};
