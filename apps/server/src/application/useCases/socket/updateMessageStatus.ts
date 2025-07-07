import { MessageStatusType } from '@bro/shared';
import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { emitWithQueueServer } from '../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const updateMessageStatus = async (
  messageId: string,
  senderId: string,
  messRepo: iMessageRepo,
  status: MessageStatusType
) => {
  await messRepo.updateMessageStatus(messageId, status);

  await emitWithQueueServer({
    userId: senderId,
    event: 'message-status-update',
    data: {
      messageId,
      status,
    },
    isDirect: true,
  });
};
