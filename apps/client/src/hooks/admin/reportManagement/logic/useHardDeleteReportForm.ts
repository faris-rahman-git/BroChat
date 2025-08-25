import { useEffect } from 'react';
import { useHardDeleteReport } from '../api/useHardDeleteReport';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { ReportSubResponse } from '@bro/shared';

export const useHardDeleteReportForm = (
  setReportList: React.Dispatch<React.SetStateAction<ReportSubResponse[]>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess, data } = useHardDeleteReport();

  useEffect(() => {
    if (isSuccess) {
      setReportList((prev) =>
        prev.filter((item) => item._id !== data.reportId)
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    mutateDeleteReport: mutate,
  };
};
