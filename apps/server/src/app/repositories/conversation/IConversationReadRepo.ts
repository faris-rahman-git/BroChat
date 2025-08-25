import {
  DeleteGroupsReturnType,
  findConversationNameType,
  GroupChatListType,
  GroupChatType,
  StatsReturn,
} from '@bro/shared';
import { usersList } from '../../../domain/dtos/user/ConversationRepoTypes';

export interface IConversationReadRepo {
  findDMs(userId: string): Promise<usersList[]>;
  findGroups(userId: string): Promise<GroupChatListType[]>;
  findDMsIds(userId: string): Promise<string[]>;
  findReceiverId(conversationId: string): Promise<string[]>;
  checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<string | null>;
  findGroupAdminIds(conversationId: string): Promise<string[]>;
  findConversationById(conversationId: string): Promise<GroupChatListType>;
  findAllGroupsWithSearch(
    query: any,
    page: number
  ): Promise<{ data: GroupChatType[]; totalPages: number }>;
  findDeletedGroups(
    searchValue: string,
    page: number
  ): Promise<{ data: DeleteGroupsReturnType[]; totalPages: number }>;

  findConversationName(
    conversationId: string,
    userId: string
  ): Promise<findConversationNameType>;

  findPersonalChatCounts(): Promise<{ totalChat: number; newChat: number }>;

  findGroupChatCounts(): Promise<{ totalChat: number; newChat: number }>;

  getGroupStatsData(): Promise<StatsReturn>
}
