import { addReactionApi } from '@client/services/home/messageServices';
import { useMutation } from '@tanstack/react-query';

export const useAddReaction = () => {
  return useMutation({
    mutationFn: addReactionApi,
  });
};
