import { groupChatListApi } from '@client/services/home/groupServices';
import { useMutation } from '@tanstack/react-query';

export const useGroupChatList = () => {
  return useMutation({
    mutationFn: groupChatListApi,
  });
};
