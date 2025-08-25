import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import { useGetDashBoard } from '../api/useGetDashBoard';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { DashBoardDataType } from '@client/types/admin/DashBoardDataType';

export const useGetDashBoardForm = (
  setDashboardData: (data: DashBoardDataType | null) => void
) => {
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useGetDashBoard();

  useEffect(() => {
    if (isSuccess) {
      setDashboardData(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return { mutate };
};
