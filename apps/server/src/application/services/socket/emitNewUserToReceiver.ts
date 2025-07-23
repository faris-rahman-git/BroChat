import { getSocketIdByUserId } from '../../../infrastructure/services/socketServices/getReceiverSocketId';
import { emitWithQueueServer } from '../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { SearchResultType } from '@bro/shared';

export const emitNewUserToReceiver = async (
  repo: iUserRepo,
  userId: string,
  receiverId: string,
  conversationId: string
) => {
  const userDetails = await repo.findDetailsById(userId);
  const receiverDetails = await repo.findDetailsById(receiverId);

  const senderSocketId = await getSocketIdByUserId(userId);
  const receiverSocketId = await getSocketIdByUserId(receiverId);

  const senderPayload: SearchResultType = {
    ...userDetails,
    conversationId,
    receiverId: userId,
    isOnline: !!senderSocketId,
  };

  const receiverPayload: SearchResultType = {
    ...receiverDetails,
    conversationId,
    receiverId,
    isOnline: !!receiverSocketId,
  };

  await emitWithQueueServer({
    userId: receiverId,
    event: 'new-user-chat',
    data: senderPayload,
    isDirect: true,
  });
  await emitWithQueueServer({
    userId: userId,
    event: 'new-user-chat',
    data: receiverPayload,
    isDirect: true,
  });
};
