import { useState, useEffect } from 'react';
import { ReportSubResponse } from '@bro/shared';
import { useGetDeletedReportsForm } from '@client/hooks/admin/reportManagement/logic/useGetDeletedReportsForm';
import { useHardDeleteReportForm } from '@client/hooks/admin/reportManagement/logic/useHardDeleteReportForm';

export const useDeletedReportsPanelHook = () => {
  const [reportList, setReportList] = useState<ReportSubResponse[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);

  const { getDeleteReportMutate, isPending } = useGetDeletedReportsForm(
    setReportList,
    setTotalPages
  );

  const { mutateDeleteReport } = useHardDeleteReportForm(setReportList);

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      getDeleteReportMutate({
        searchValue,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        getDeleteReportMutate({
          searchValue,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleHardDeleteReport = (reportId: string) => {
    mutateDeleteReport(reportId);
  };

  return {
    handleHardDeleteReport,
    reportList,
    searchValue,
    setSearchValue,
    totalPages,
    isPending,
    mutate: getDeleteReportMutate,
  };
};
