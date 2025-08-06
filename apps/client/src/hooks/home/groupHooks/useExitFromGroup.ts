import { exitFromGroupApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useExitFromGroup = () => {
  return useMutation({
    mutationFn: exitFromGroupApi,
  });
};
