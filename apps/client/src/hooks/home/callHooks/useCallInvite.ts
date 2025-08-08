import { callInviteApi } from '@client/services/home/callService';
import { useMutation } from '@tanstack/react-query';

export const useCallInvite = () => {
  return useMutation({
    mutationFn: callInviteApi,
  });
};
