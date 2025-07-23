import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { checkIsAdmin } from '../../../services/home/groupServices/checkIsAdmin';
import AppError from '../../../../infrastructure/errors/AppError';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { getReceiverId } from '../../../services/socket/getReceiverId';

export const removeGroupMemberHelper = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string,
  memberId: string
): Promise<void> => {
  const isAuth = await checkIsAdmin(conRepo, conversationId, userId);

  if (!isAuth) throw new AppError('You are not admin of this group!', 403);

  await conRepo.removeGroupMember(conversationId, memberId);

  await emitWithQueueServer({
    userId: memberId,
    event: 'remove-group-chat',
    data: { conversationId },
    isDirect: true,
  });

  const receiversId = await getReceiverId(conRepo, conversationId, memberId);

  receiversId.forEach(async (receiverId) => {
    if (receiverId !== userId) {
      await emitWithQueueServer({
        userId: receiverId,
        event: 'remove-group-member',
        data: { conversationId, memberId },
        isDirect: true,
      });
    }
  });
};
