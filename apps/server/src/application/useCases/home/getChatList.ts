import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { filterUserConversations } from '../../services/home/filterUserConversations';
import { SearchResultType } from '@bro/shared';

export const getChatList = async (
  conRepo: iConversationRepo,
  userId: string
): Promise<SearchResultType[]> => {
  const usersList = await conRepo.findDMs(userId);
  const userConversations: SearchResultType[] = await filterUserConversations(
    usersList,
    userId
  );
  return userConversations;
};
