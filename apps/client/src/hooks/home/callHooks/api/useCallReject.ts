import { callRejectApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallReject = () => {
  return useMutation({
    mutationFn: callRejectApi,
  });
};
