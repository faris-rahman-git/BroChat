import { getUserIds } from '../../../../application/useCases/socket/getUserIds';
import { conversationRepo } from '../../../repositories/conversationRepo';
import { clearTypingQueue, getAllTypingReceivers } from '../../../services/redis/typingQueue';
import { emitWithQueueServer } from '../offlineQueue/emitWithQueueServer';

export const notifyOnlineOfllineUsers = async (
  userId: string,
  isOnline: boolean
) => {
  // mark as online
  const conRepo = new conversationRepo();
  const userChatList = await getUserIds(conRepo, userId);
  for (let i = 0; i < userChatList.length; i++) {
    await emitWithQueueServer({
      userId: userChatList[i],
      event: isOnline ? 'user-online' : 'user-offline',
      data: userId,
      isDirect: true,
    });
  }

  if (!isOnline) {
    const typingReceivers = await getAllTypingReceivers(userId);

    for (const receiverId of typingReceivers) {
      await emitWithQueueServer({
        userId: receiverId,
        event: 'typing-status',
        data: {
          senderId: userId,
          status: false,
        },
        isDirect: true,
      });
    }

    // Clean up typing queue in Redis
    await clearTypingQueue(userId);
  }
};
