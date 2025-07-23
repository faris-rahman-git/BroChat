import { MessageStatusType } from '@bro/shared';
import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { emitWithQueueServer } from '../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const updateMessageStatus = async (
  messRepo: iMessageRepo,
  messageId: string,
  senderId: string,
  receiverId: string,
  status: MessageStatusType
) => {
  const newStatus = await messRepo.updateMessageStatus(
    messageId,
    receiverId,
    status
  );

  if (!newStatus) return;

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
