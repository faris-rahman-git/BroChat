import { useMutation } from '@tanstack/react-query';
import { getPrevMessageApi } from '@client/services/homeServices';

export const usePrevMessages = () => {
  return useMutation({
    mutationFn: getPrevMessageApi,
  });
};
