import { iConversationRepo } from '../../../interfaces/iConversationRepo';
import { iMessageRepo } from '../../../interfaces/iMessageRepo';
import { DeleteMessageType } from '@bro/shared';
import { getReceiverId } from '../../../services/socket/getReceiverId';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const deleteMessageHelper = async (
  messRepo: iMessageRepo,
  conRepo: iConversationRepo,
  messageId: string,
  conversationId: string,
  userId: string,
  type: DeleteMessageType
): Promise<void> => {
  if (type === 'me') {
    await messRepo.deleteMessageForUser(messageId, userId);
  } else {
    await messRepo.deleteMessage(messageId);
    const receiversId = await getReceiverId(conRepo, conversationId, userId);
    receiversId.forEach(async (receiverId) => {
      await emitWithQueueServer({
        userId: receiverId,
        event: 'delete-message',
        data: { conversationId, messageId },
        isDirect: true,
      });
    });
  }
};
