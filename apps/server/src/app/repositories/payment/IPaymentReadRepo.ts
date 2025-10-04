import {
  AllTransactionsOutType,
  ExclusiveUserPaymentsType,
  findAllExclusiveUserCustomersTransactionsType,
  GetExclusiveUserPaymentsApiType,
  StatsReturn,
} from '@bro/shared';

export interface IPaymentReadRepo {
  getAllTransactions(
    quary: any,
    page: number
  ): Promise<{
    data: AllTransactionsOutType[];
    totalPages: number;
  }>;

  findAllExclusiveUserCustomersTransactions(userId: string): Promise<{
    list: findAllExclusiveUserCustomersTransactionsType[];
    totalCount: number;
    totalAmount: number;
  }>;

  findExclusiveUserPayments(
    data: GetExclusiveUserPaymentsApiType
  ): Promise<{ data: ExclusiveUserPaymentsType[]; totalPages: number }>;

  findTotalRevenue(): Promise<{ totalRevenue: number; todayRevenue: number }>;

  getRevenueStats(): Promise<StatsReturn>;

  findExclusivePayment(userId: string): Promise<string | undefined>;
}
