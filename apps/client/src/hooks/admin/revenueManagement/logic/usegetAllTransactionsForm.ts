import { useEffect } from 'react';
import { usegetAllTransactions } from '../api/useGetSubscriptionDetails';
import { AllTransactionsOutType } from '@bro/shared';

export const usegetAllTransactionsForm = (
  setTransactionList: React.Dispatch<
    React.SetStateAction<AllTransactionsOutType[]>
  >,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isPending, isSuccess, isError, mutate, error, data } =
    usegetAllTransactions();

  useEffect(() => {
    if (isSuccess) {
      setTransactionList(data.transactions);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  return {
    mutate,
    isPending,
  };
};
