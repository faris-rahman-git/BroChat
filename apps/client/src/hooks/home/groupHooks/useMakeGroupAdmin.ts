import { makeGroupAdminApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useMakeGroupAdmin = () => {
  return useMutation({
    mutationFn: makeGroupAdminApi,
  });
};
