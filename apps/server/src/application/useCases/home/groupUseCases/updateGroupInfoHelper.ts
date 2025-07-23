import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { checkIsAdmin } from '../../../services/home/groupServices/checkIsAdmin';
import AppError from '../../../../infrastructure/errors/AppError';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { getReceiverId } from '../../../services/socket/getReceiverId';
import { updateGroupInfoType } from '@bro/shared';

export const updateGroupInfoHelper = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string,
  groupInfo: updateGroupInfoType
): Promise<void> => {
  const isAuth = await checkIsAdmin(conRepo, conversationId, userId);

  if (!isAuth) throw new AppError('You are not admin of this group!', 403);

  await conRepo.updateGroupInfo(conversationId, groupInfo);

  const receiversId = await getReceiverId(conRepo, conversationId, userId);

  receiversId.forEach(async (receiverId) => {
    await emitWithQueueServer({
      userId: receiverId,
      event: 'update-group-info',
      data: { conversationId, groupInfo },
      isDirect: true,
    });
  });
  
};
