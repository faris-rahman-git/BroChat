import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useGetAllTransaction } from '../api/useGetAllTransactions';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { TransactionsArrayType } from '@client/types/profileType/TransactionsType';

export const useGetAllTransactionForm = (
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsArrayType>>
) => {
  const dispatch = useAppDispatch();

  const { mutate, isPending, isSuccess, data } = useGetAllTransaction();

  useEffect(() => {
    if (isSuccess) {
      setTransactions({
        list: data.list,
        totalCount: data.totalCount,
        totalAmount: data.totalAmount,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    getTransMutate: mutate,
  };
};
