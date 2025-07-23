import { SearchResultType } from '@bro/shared';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { findUsersWithConversationIds } from '../../../services/home/findUsersWithConversationIds';

export const searchUserHelper = async (
  repo: iUserRepo,
  conRepo: iConversationRepo,
  searchData: string,
  userId: string
): Promise<SearchResultType[]> => {
  const matchedUsers = await repo.findMatchUsers(searchData, userId);
  const matchedUsersWithConversationId: SearchResultType[] =
    await findUsersWithConversationIds(matchedUsers, conRepo, userId);
  return matchedUsersWithConversationId;
};
