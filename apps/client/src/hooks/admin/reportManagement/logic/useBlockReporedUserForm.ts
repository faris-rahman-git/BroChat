import { useEffect } from 'react';
import { useBlockReporedUser } from '../api/useBlockReporedUser';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { ReportSubResponse } from '@bro/shared';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

export const useBlockReporedUserForm = (
  setReportList: React.Dispatch<React.SetStateAction<ReportSubResponse[]>>
) => {
  const dispatch = useAppDispatch();

  const { isPending, mutate, isSuccess, data } = useBlockReporedUser();

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
    mutateBlock: mutate,
  };
};
