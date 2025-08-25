import { getDashBoardApi } from '@client/services/admin/dashBoardService';
import { useMutation } from '@tanstack/react-query';

export const useGetDashBoard = () => {
  return useMutation({
    mutationFn: getDashBoardApi,
  });
};
