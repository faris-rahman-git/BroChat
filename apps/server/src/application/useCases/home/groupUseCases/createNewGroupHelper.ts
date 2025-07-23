import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { emitNewGroupToMembers } from '../../../services/socket/emitNewGroupToMembers';
import { GroupMember } from '@bro/shared';

export const createNewGroupHelper = async (
  conRepo: iConversationRepo,
  repo: iUserRepo,
  userId: string,
  groupName: string,
  groupMembers: string[],
  groupAvatarUrl: string
) => {
  const newConversation = await conRepo.createNewGroup(
    userId,
    groupName,
    groupMembers,
    groupAvatarUrl
  );

  const allMemberIds = [userId, ...groupMembers];
  const participants: GroupMember[] = await repo.getUsersMinimalDetails(
    allMemberIds
  );

  await emitNewGroupToMembers(
    {
      _id: newConversation._id,
      participants,
      Admins: [userId],
      avatar: groupAvatarUrl,
      groupName,
      about: '',
      createdBy: userId,
      createdAt: newConversation.createdAt,
    },
    participants
  );
};
