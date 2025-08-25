import { removeReactionApi } from '@client/services/home/messageServices';
import { useMutation } from '@tanstack/react-query';

export const useRemoveReaction = () => {
  return useMutation({
    mutationFn: removeReactionApi,
  });
};
