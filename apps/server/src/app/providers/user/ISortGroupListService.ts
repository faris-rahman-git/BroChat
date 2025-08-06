import { GroupChatListType } from '@bro/shared';

export interface ISortGroupListService {
  sortGroupList(groupList: GroupChatListType[] , userId: string): GroupChatListType[];
  sortNewGroupList(payload: GroupChatListType  , userId: string): GroupChatListType;
}
