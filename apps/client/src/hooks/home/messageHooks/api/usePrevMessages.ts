import { getPrevMessageApi } from '@client/services/home/messageServices';
import { useMutation } from '@tanstack/react-query';

export const usePrevMessages = () => {
  return useMutation({
    mutationFn: getPrevMessageApi,
  });
};
