import { oneToOneChatListApi } from '@client/services/home/dmServices';
import { useMutation } from '@tanstack/react-query';

export const useOneToOneChatList = () => {
  return useMutation({
    mutationFn: oneToOneChatListApi,
  });
};
