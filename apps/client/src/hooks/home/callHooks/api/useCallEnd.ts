import { callEndApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallEnd = () => {
  return useMutation({
    mutationFn: callEndApi,
  });
};
