import { useState, useEffect } from 'react';
import { useGetResolvedReportsForm } from '@client/hooks/admin/reportManagement/logic/useGetResolvedReportsForm';
import { ReportSubResponse } from '@bro/shared';

export const useResolvedReportsPanelHook = () => {
  const [reportList, setReportList] = useState<ReportSubResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState<string>('');

  const { mutate, isPending } = useGetResolvedReportsForm(
    setReportList,
    setTotalPages
  );

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      mutate({
        searchValue,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({
          searchValue,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  return {
    reportList,
    totalPages,
    searchValue,
    setSearchValue,
    isPending,
    mutate,
  };
};
