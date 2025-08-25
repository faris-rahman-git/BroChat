import { useEffect } from 'react';
import { useIgnoreReport } from '../api/useIgnoreReport';
import { ReportSubResponse } from '@bro/shared';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useIgnoreReportForm = (
  setReportList: React.Dispatch<React.SetStateAction<ReportSubResponse[]>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess, data } = useIgnoreReport();

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
    mutateIgnore: mutate,
  };
};
