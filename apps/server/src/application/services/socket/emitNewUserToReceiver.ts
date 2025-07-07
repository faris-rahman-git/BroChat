import { getSocketIdByUserId } from '../../../infrastructure/services/socketServices/getReceiverSocketId';
import { emitWithQueueServer } from '../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { iUserRepo } from '../../interfaces/iUserRepo';

export const emitNewUserToReceiver = async (
  repo: iUserRepo,
  userId: string,
  receiverId: string,
  conversationId: string
) => {
  const userDetails = await repo.findDetailsById(userId);

  const socketId = await getSocketIdByUserId(userId);

  const payload = {
    ...userDetails,
    conversationId,
    receiverId: userId,
    isOnline: !!socketId,
  };

  await emitWithQueueServer({
    userId: receiverId,
    event: 'new-user-chat',
    data: payload,
    isDirect: true,
  });
};
