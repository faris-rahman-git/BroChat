import { GroupMember } from '../home/groupTypes.js';
import { PaymentType } from '../home/PaymentTypes.js';

export type getAllPaymetsType = {
  searchValue?: string;
  type?: string;
  createdAt?: string;
  page: number;
};

export type AllTransactionsOutType = {
  feature: PaymentType;
  userId?: string;
  conversationId?: string;
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  recipientEmail: string;
  recipientName: string;
  createdAt: Date | string;
};

export type ExclusiveUserPaymentsType = {
  exclusiveUser: GroupMember;
  totalCustomers: number;
  totalAmount: number;
  userShare: number;
  adminShare: number;
  customers: (AllTransactionsOutType & {
    adminShare: number;
    userShare: number;
  })[];
};

export type GetExclusiveUserPaymentsApiType = {
  searchValue: string;
  page: number;
};
