import {
  MainAllUsersListType,
  GroupMember,
  userDetailsType,
  StatsReturn,
} from '@bro/shared';
import {
  FindEmailType,
  SearchRawType,
} from '../../../domain/entity/user/UserRepoTypes';

export interface IUserReadRepo {
  findEmail(email: string): Promise<FindEmailType | null>;
  findUserDetailsById(userId: string): Promise<userDetailsType>;
  findUsername(username: string): Promise<string | null>;
  findMatchUsers(searchData: string, userId: string): Promise<SearchRawType[]>;
  findDetailsById(userId: string): Promise<Omit<SearchRawType, '_id'>>;
  findAllUsersWithSearch(
    query: any,
    page: number
  ): Promise<MainAllUsersListType>;
  findDeletedUsers(
    searchValue: string,
    page: number
  ): Promise<MainAllUsersListType>;
  getUsersMinimalDetails(userIds: string[]): Promise<GroupMember[]>;

  findIsSubscribed(userId: string): Promise<boolean>;

  findExpiredSubscriptionsUserId(): Promise<string[]>;

  findUserCounts(): Promise<{ totalUsers: number; activeUsers: number }>;

  getUserStatsData(): Promise<StatsReturn>;
}
