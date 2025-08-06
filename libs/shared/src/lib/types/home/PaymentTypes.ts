export type PaymentType = 'premium_group' | 'monthly' | 'yearly';

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
};

