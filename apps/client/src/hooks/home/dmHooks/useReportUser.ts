import { reportUserApi } from '@client/services/home/dmServices';
import { useMutation } from '@tanstack/react-query';

export const useReportUser = () => {
  return useMutation({
    mutationFn: reportUserApi,
  });
};
