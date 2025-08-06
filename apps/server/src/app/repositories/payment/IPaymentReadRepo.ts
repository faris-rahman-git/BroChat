import { AllTransactionsOutType } from '@bro/shared';

export interface IPaymentReadRepo {
  getAllTransactions(
    quary: any,
    page: number
  ): Promise<{
    data: AllTransactionsOutType[];
    totalPages: number;
  }>;
}
