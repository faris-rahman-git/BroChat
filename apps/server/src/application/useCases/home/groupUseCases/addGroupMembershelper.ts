import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { checkIsAdmin } from '../../../services/home/groupServices/checkIsAdmin';
import AppError from '../../../../infrastructure/errors/AppError';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { getReceiverId } from '../../../services/socket/getReceiverId';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { emitNewGroupToMembers } from '../../../services/socket/emitNewGroupToMembers';

export const addGroupMembershelper = async (
  conRepo: iConversationRepo,
  repo: iUserRepo,
  conversationId: string,
  userId: string,
  newMembersId: string[]
): Promise<void> => {
  const isAuth = await checkIsAdmin(conRepo, conversationId, userId);

  if (!isAuth) throw new AppError('You are not admin of this group!', 403);

  await conRepo.addMoreParticipants(conversationId, newMembersId);

  const receiversId = await getReceiverId(conRepo, conversationId, userId);

  const newMemberDetails = await repo.getUsersMinimalDetails(newMembersId);

  [...receiversId, userId].forEach(async (receiverId) => {
    await emitWithQueueServer({
      userId: receiverId,
      event: 'add-group-members',
      data: { newMemberDetails, conversationId },
      isDirect: true,
    });
  });

  const conversationDetails = await conRepo.findConversationById(
    conversationId
  );

  await emitNewGroupToMembers(
    {
      _id: conversationDetails._id,
      participants: conversationDetails.participants,
      Admins: conversationDetails.Admins,
      avatar: conversationDetails.avatar,
      groupName: conversationDetails.groupName,
      about: conversationDetails.about,
      createdBy: conversationDetails.createdBy,
      createdAt: conversationDetails.createdAt,
    },
    newMemberDetails
  );
};
