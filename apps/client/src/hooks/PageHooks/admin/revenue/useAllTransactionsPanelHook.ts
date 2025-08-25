import { useState, useEffect } from 'react';
import { usegetAllTransactionsForm } from '@client/hooks/admin/revenueManagement/logic/usegetAllTransactionsForm';
import { AllTransactionsOutType } from '@bro/shared';

export const useAllTransactionsPanelHook = () => {
  const [transactionList, setTransactionList] = useState<
    AllTransactionsOutType[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    createdAt: '',
  });
  const [currentPage, setCurrentPage] = useState(1);


  const {isPending , mutate} = usegetAllTransactionsForm(setTransactionList, setTotalPages);

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      mutate({
        searchValue,
        ...filters,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({
          searchValue,
          ...filters,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setFilters((prev) => ({
      ...prev,
      createdAt: selectedDate.toLocaleDateString('en-CA'),
    }));
  };

  const handleSearchWithFilters = () => {
    mutate({
      searchValue,
      ...filters,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      type: '',
      createdAt: '',
    };
    setFilters(clearedFilters);
    mutate({
      searchValue,
      ...clearedFilters,
      page: 1,
    });
  };

  return {
    handleDateSelect,
    handleSearchWithFilters,
    handleClearFilters,
    isPending,
    mutate,
    transactionList,
    totalPages,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    currentPage, setCurrentPage
  };

};
