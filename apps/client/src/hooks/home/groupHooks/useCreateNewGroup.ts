import { createNewGroupApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useCreateNewGroup = () => {
  return useMutation({
    mutationFn: createNewGroupApi,
  });
};
