import { blockReporedUserApi } from '@client/services/admin/reportServices';
import { useMutation } from '@tanstack/react-query';

export const useBlockReporedUser = () => {
  return useMutation({
    mutationFn: blockReporedUserApi,
  });
};
