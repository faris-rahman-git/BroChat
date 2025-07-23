import { unBlockUserApi } from '@client/services/home/dmServices';
import { useMutation } from '@tanstack/react-query';

export const useUnBlockUser = () => {
  return useMutation({
    mutationFn: unBlockUserApi,
  });
};
