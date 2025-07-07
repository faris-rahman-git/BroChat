import { createNewConversationApi } from '@client/services/homeServices';
import { useMutation } from '@tanstack/react-query';

export const useCreateNewConversation = () => {
  return useMutation({
    mutationFn: createNewConversationApi,
  });
};
