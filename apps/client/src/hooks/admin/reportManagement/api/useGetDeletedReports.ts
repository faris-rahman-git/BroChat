import { getDeletedReportsApi } from '@client/services/admin/reportServices';
import { useMutation } from '@tanstack/react-query';

export const useGetDeletedReports = () => {
  return useMutation({
    mutationFn: getDeletedReportsApi,
  });
};
