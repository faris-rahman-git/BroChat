import { SearchResultType } from '@bro/shared';
import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { findUsersWithConversationIds } from '../../services/home/findUsersWithConversationIds';

export const findMatchUsers = async (
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
