import { useEffect } from 'react';
import { useGetDeletedReports } from '../api/useGetDeletedReports';
import { ReportSubResponse } from '@bro/shared';

export const useGetDeletedReportsForm = (
  setReportList: (data: ReportSubResponse[]) => void,
  setTotalPages: (totalPages: number) => void,
) => {
  const { isPending, isSuccess, mutate, data } = useGetDeletedReports();

  useEffect(() => {
    if (isSuccess) {
      setReportList(data.reportList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  return {
    getDeleteReportMutate: mutate,
    isPending,
  };
};
