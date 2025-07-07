import { Socket } from 'socket.io';
import { emitWithQueueServer } from '../offlineQueue/emitWithQueueServer';
import {
  addStartTypingToQueue,
  checkStartTypingIncludes,
  removeStartTypingFromQueue,
} from '../../../services/redis/typingQueue';

export const handleTyping = async (socket: Socket) => {
  const senderId = socket.user?.id as string as string;

  socket.on(
    'start-typing',
    async (
      { receiverId }: { receiverId: string },
      ack: (ack: boolean) => void
    ) => {
      const exist = await checkStartTypingIncludes(senderId, receiverId);
      if (!exist) await addStartTypingToQueue(senderId, receiverId);

      if (typeof ack === 'function') ack(true);
      await emitWithQueueServer({
        userId: receiverId,
        event: 'typing-status',
        data: {
          senderId,
          status: true,
        },
        isDirect: true,
      });
    }
  );

  socket.on(
    'stop-typing',
    async (
      { receiverId }: { receiverId: string },
      ack: (ack: boolean) => void
    ) => {

      const exist = await checkStartTypingIncludes(senderId, receiverId);
      if(exist) await removeStartTypingFromQueue(senderId, receiverId);

      if (typeof ack === 'function') ack(true);
      await emitWithQueueServer({
        userId: receiverId,
        event: 'typing-status',
        data: {
          senderId,
          status: false,
        },
        isDirect: true,
      });
    }
  );
};
