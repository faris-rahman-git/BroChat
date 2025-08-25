import { useEffect } from 'react';
import { ReportSubResponse } from '@bro/shared';
import { useGetAllReports } from '../api/useGetAllReports';

export const useGetAllReportsForm = (
  setReportList: React.Dispatch<React.SetStateAction<ReportSubResponse[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isPending, isSuccess, mutate, data } = useGetAllReports();

  useEffect(() => {
    if (isSuccess) {
      setReportList(data.reportList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  return {
    getAllReportMutate: mutate,
    isPending,
  };
};
