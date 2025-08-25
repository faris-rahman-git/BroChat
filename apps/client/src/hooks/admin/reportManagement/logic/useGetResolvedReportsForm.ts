import { useEffect } from 'react';
import { useGetResolvedReports } from '../api/useGetResolvedReports';
import { ReportSubResponse } from '@bro/shared';

export const useGetResolvedReportsForm = (
  setReportList: React.Dispatch<React.SetStateAction<ReportSubResponse[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isPending, isSuccess, mutate, data } = useGetResolvedReports();

  useEffect(() => {
    if (isSuccess) {
      setReportList(data.reportList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  return {
     mutate,
    isPending,
  };
};
