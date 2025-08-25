import { getAllTransactionApi } from '@client/services/home/profileService';
import { useMutation } from '@tanstack/react-query';

export const useGetAllTransaction = () => {
  return useMutation({
    mutationFn: getAllTransactionApi,
  });
};
