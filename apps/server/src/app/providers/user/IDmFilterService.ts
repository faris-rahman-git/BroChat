import { SearchResultType } from '@bro/shared';
import { SearchRawType } from '../../../domain/dtos/user/UserRepoTypes';
import { usersList } from '../../../domain/dtos/user/ConversationRepoTypes';

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
