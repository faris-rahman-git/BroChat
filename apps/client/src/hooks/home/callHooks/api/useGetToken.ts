import { getTokenApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useGetToken = () => {
  return useMutation({
    mutationFn: getTokenApi,
  });
};
