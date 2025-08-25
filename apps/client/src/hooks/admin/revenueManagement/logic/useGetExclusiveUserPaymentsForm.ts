import { useEffect } from 'react';
import { useGetExclusiveUserPayments } from '../api/useGetExclusiveUserPayments';
import { ExclusiveUserPaymentsType } from '@bro/shared';

export const useGetExclusiveUserPaymentsForm = (
  setTransactionList: React.Dispatch<
    React.SetStateAction<ExclusiveUserPaymentsType[]>
  >,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetExclusiveUserPayments();

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
