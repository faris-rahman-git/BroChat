import { blockUserApi } from '@client/services/home/dmServices';
import { useMutation } from '@tanstack/react-query';

export const useBlockUser = () => {
  return useMutation({
    mutationFn: blockUserApi,
  });
};
