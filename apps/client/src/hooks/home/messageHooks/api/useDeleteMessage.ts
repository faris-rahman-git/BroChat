import { deleteMessageApi } from '@client/services/home/messageServices';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: deleteMessageApi,
  });
};
