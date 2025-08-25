import { getAllTransactionsApi } from '@client/services/admin/revenueServices';
import { useMutation } from '@tanstack/react-query';

export const usegetAllTransactions = () => {
  return useMutation({
    mutationFn: getAllTransactionsApi,
  });
};
