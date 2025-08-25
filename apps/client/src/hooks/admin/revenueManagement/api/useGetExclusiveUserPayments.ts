import { getExclusiveUserPaymentsApi } from '@client/services/admin/revenueServices';
import { useMutation } from '@tanstack/react-query';

export const useGetExclusiveUserPayments = () => {
  return useMutation({
    mutationFn: getExclusiveUserPaymentsApi,
  });
};
