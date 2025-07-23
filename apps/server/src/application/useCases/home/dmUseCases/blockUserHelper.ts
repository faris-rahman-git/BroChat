import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { getReceiverId } from '../../../services/socket/getReceiverId';

export const blockUserHelper = async (
  repo: iUserRepo,
  conRepo: iConversationRepo,
  userId: string,
  conversationId: string
): Promise<void> => {
  const result = await getReceiverId(conRepo, conversationId, userId);
  const receiverId = result[0];

  await repo.blockUser(userId, receiverId);

  await emitWithQueueServer({
    userId: receiverId,
    event: 'block-user-update',
    data: { conversationId, hasBlockedMe: true },
    isDirect: true,
  });
};
