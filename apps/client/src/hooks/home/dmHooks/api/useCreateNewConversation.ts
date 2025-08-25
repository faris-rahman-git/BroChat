import { createNewConversationApi } from '@client/services/home/dmServices';
import { useMutation } from '@tanstack/react-query';

export const useCreateNewConversation = () => {
  return useMutation({
    mutationFn: createNewConversationApi,
  });
};
