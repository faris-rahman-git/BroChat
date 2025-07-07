import { useMutation } from '@tanstack/react-query';
import { chatListApi } from '@client/services/homeServices';

export const useChatList = () => {
  return useMutation({
    mutationFn: chatListApi,
  });
};
