import { useState, useEffect } from 'react';
import { useGetExclusiveUserPaymentsForm } from '@client/hooks/admin/revenueManagement/logic/useGetExclusiveUserPaymentsForm';
import { ExclusiveUserPaymentsType } from '@bro/shared';

export const useExclusiveUserPaymentsPanelHook = () => {
  const [transactionList, setTransactionList] = useState<
    ExclusiveUserPaymentsType[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, mutate } = useGetExclusiveUserPaymentsForm(
    setTransactionList,
    setTotalPages
  );

  useEffect(() => {
    mutate({ searchValue: searchValue, page: 1 });
  }, [searchValue]);

  return {
    transactionList,
    searchValue,
    setSearchValue,
    totalPages,
    isPending,
    mutate,
    currentPage, setCurrentPage
  };
};
