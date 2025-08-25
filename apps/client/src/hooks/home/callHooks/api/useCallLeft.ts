import { callLeftApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallLeft = () => {
  return useMutation({
    mutationFn: callLeftApi,
  });
};
