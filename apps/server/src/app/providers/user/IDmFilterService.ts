import { SearchResultType } from '@bro/shared';
import { SearchRawType } from '../../../domain/entity/user/UserRepoTypes';
import { usersList } from '../../../domain/entity/user/ConversationRepoTypes';

export interface IDmFilterService {
  filterUserConversationsHelper(
    usersList: usersList[],
    userId: string
  ): Promise<SearchResultType[]>;

  findUsersWithConversationIdsHelper(
    matchedUsers: SearchRawType[],
    userId: string
  ): Promise<SearchResultType[]>;
}
