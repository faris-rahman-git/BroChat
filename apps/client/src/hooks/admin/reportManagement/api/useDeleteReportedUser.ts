import { deleteReportApi } from '@client/services/admin/reportServices';
import { useMutation } from '@tanstack/react-query';

export const useDeleteReport = () => {
  return useMutation({
    mutationFn: deleteReportApi,
  });
};
