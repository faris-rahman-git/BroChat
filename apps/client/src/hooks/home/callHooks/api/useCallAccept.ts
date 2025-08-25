import { callAcceptApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallAccept = () => {
  return useMutation({
    mutationFn: callAcceptApi,
  });
};
