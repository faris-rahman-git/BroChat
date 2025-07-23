import { SearchResultType } from '@bro/shared';
import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { filterUserConversations } from '../../../services/home/filterUserConversations';

export const oneToOneChatListHelper = async (
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
