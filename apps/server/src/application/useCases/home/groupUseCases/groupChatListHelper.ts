import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { GroupChatListType } from '@bro/shared';

export const groupChatListHelper = async (
  conRepo: iConversationRepo,
  userId: string
): Promise<GroupChatListType[]> => {
  const groupList = await conRepo.findGroups(userId);

  const sortedGroupList = groupList.map((group) => {
    const { participants, Admins } = group;

    const sortedParticipants = [...participants].sort((a: any, b: any) => {
      const aId = typeof a === 'string' ? a : a._id;
      const bId = typeof b === 'string' ? b : b._id;

      const aScore = aId === userId ? 0 : Admins.includes(aId) ? 1 : 2;
      const bScore = bId === userId ? 0 : Admins.includes(bId) ? 1 : 2;

      return aScore - bScore;
    });

    return {
      ...group,
      participants: sortedParticipants,
    };
  });

  return sortedGroupList;
};
