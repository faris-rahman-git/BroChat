import { Socket } from 'socket.io';
import { saveMessages } from '../../../../application/useCases/socket/saveMessages';
import { messageRepo } from '../../../repositories/messageRepo';
import { conversationRepo } from '../../../repositories/conversationRepo';
import { MessageType } from '@bro/shared';
import {
  addToTempIdCache,
  isTempIdCached,
  removeFromTempIdCache,
} from '../../../../utils/socket/tempIdCache';
import { emitWithQueueServer } from '../offlineQueue/emitWithQueueServer';

export const handleMessage = (socket: Socket) => {
  socket.on(
    'send-message',
    async (data: MessageType, ack: (ack: boolean) => void) => {
      const tempId = data.tempId as string;
      try {
        // 1. Check in-memory cache
        if (isTempIdCached(tempId)) {
          if (typeof ack === 'function') ack(true);
          return;
        }
        addToTempIdCache(tempId);

        const messRepo = new messageRepo();
        const conRepo = new conversationRepo();

        // 2. Optional: check DB (if cache missed)
        const exists = await messRepo.findByTempId(tempId);
        if (exists) {
          if (typeof ack === 'function') ack(true);
          return;
        }

        const { receiversId, savedMessage } = await saveMessages(
          { ...data, status: 'sent' },
          messRepo,
          conRepo
        );
        if (typeof ack === 'function') ack(true);

        // Emit the message sent status to the sender
        await emitWithQueueServer({
          userId: socket.user?.id as string,
          event: 'message-status-sent',
          data: {
            tempId: tempId,
            savedMessage,
          },
          isDirect: true,
        });

        // Emit the message to the receiver
        receiversId.forEach(async (receiverId) => {
          await emitWithQueueServer({
            userId: receiverId,
            event: 'new-message',
            data: savedMessage,
            isDirect: true,
          });
        });
      } catch (err) {
        console.log(err);
        removeFromTempIdCache(tempId);
        if (typeof ack === 'function') ack(false);
      }
    }
  );
};
