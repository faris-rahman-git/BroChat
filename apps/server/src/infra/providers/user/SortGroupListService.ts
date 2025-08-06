import { GroupChatListType, GroupMember } from '@bro/shared';
import { ISortGroupListService } from '../../../app/providers/user/ISortGroupListService';

export class SortGroupListService implements ISortGroupListService {
  private sortParticipants(
    participants: GroupMember[],
    currentUserId: string,
    admins: string[]
  ): GroupMember[] {
    return [...participants].sort((a: any, b: any) => {
      const aId = typeof a === 'string' ? a : a._id;
      const bId = typeof b === 'string' ? b : b._id;

      const aScore = aId === currentUserId ? 0 : admins.includes(aId) ? 1 : 2;
      const bScore = bId === currentUserId ? 0 : admins.includes(bId) ? 1 : 2;

      return aScore - bScore;
    });
  }

  sortGroupList(
    groupList: GroupChatListType[],
    userId: string
  ): GroupChatListType[] {
    const sortedGroupList = groupList.map((group) => {
      const sorted = this.sortNewGroupList(group, userId);

      return sorted;
    });

    return sortedGroupList;
  }

  sortNewGroupList(
    payload: GroupChatListType,
    userId: string
  ): GroupChatListType {
    const sorted = this.sortParticipants(
      payload.participants,
      userId,
      payload.Admins
    );

    const personalizedPayload = {
      ...payload,
      participants: sorted,
    };

    return personalizedPayload;
  }
}
