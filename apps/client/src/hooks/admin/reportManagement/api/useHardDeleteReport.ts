import { hardDeleteReportApi } from '@client/services/admin/reportServices';
import { useMutation } from '@tanstack/react-query';

export const useHardDeleteReport = () => {
  return useMutation({
    mutationFn: hardDeleteReportApi,
  });
};
