export type CreateOrderType = {
  id: string;
  currency: string;
  amount: number | string;
  receipt?: string;
};

export type verifyPaymentType = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
