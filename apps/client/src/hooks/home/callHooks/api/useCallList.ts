import { callListApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallList = () => {
  return useMutation({
    mutationFn: callListApi,
  });
};
