import { ignoreReportApi } from '@client/services/admin/reportServices';
import { useMutation } from '@tanstack/react-query';

export const useIgnoreReport = () => {
  return useMutation({
    mutationFn: ignoreReportApi,
  });
};
