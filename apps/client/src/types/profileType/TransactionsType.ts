import { findAllExclusiveUserCustomersTransactionsType } from '@bro/shared';

export type TransactionsArrayType = {
  list: findAllExclusiveUserCustomersTransactionsType[];
  totalCount: number;
  totalAmount: number;
};
