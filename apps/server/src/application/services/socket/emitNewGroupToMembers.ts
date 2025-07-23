import { GroupChatListType, GroupMember } from '@bro/shared';
import { emitWithQueueServer } from '../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const emitNewGroupToMembers = async (
  payload: GroupChatListType,
  participants: GroupMember[]
) => {
  for (const member of participants) {
    const currentUserId = member._id;

    const sortedParticipants = payload.participants.sort((a, b) => {
      const aId = typeof a === 'string' ? a : a._id;
      const bId = typeof b === 'string' ? b : b._id;

      const aScore =
        aId === currentUserId ? 0 : payload.Admins.includes(aId) ? 1 : 2;
      const bScore =
        bId === currentUserId ? 0 : payload.Admins.includes(bId) ? 1 : 2;

      return aScore - bScore;
    });

    const personalizedPayload = {
      ...payload,
      participants: sortedParticipants,
    };

    await emitWithQueueServer({
      userId: currentUserId,
      event: 'new-group-chat',
      data: personalizedPayload,
      isDirect: true,
    });
  }
};
