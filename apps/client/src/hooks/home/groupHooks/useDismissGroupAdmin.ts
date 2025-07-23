import { dismissGroupAdminApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useDismissGroupAdmin = () => {
  return useMutation({
    mutationFn: dismissGroupAdminApi,
  });
};
