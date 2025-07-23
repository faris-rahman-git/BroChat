import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { checkIsAdmin } from '../../../services/home/groupServices/checkIsAdmin';
import AppError from '../../../../infrastructure/errors/AppError';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { getReceiverId } from '../../../services/socket/getReceiverId';

export const dismissGroupAdminHelper = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string,
  memberId: string
): Promise<void> => {
  const isAuth = await checkIsAdmin(conRepo, conversationId, userId);

  if (!isAuth) throw new AppError('You are not admin of this group!', 403);

  await conRepo.dismissGroupAdmin(conversationId, memberId);

  const receiversId = await getReceiverId(conRepo, conversationId, userId);

  receiversId.forEach(async (receiverId) => {
    await emitWithQueueServer({
      userId: receiverId,
      event: 'dismiss-group-admin',
      data: { conversationId, memberId },
      isDirect: true,
    });
  });
};
