import { Socket } from 'socket.io';
import { messageRepo } from '../../../repositories/messageRepo';
import { conversationRepo } from '../../../repositories/conversationRepo';
import { EditMessageType } from '@bro/shared';
import { emitWithQueueServer } from '../offlineQueue/emitWithQueueServer';
import { editMessageHelper } from '../../../../application/useCases/socket/editMessageHelper';

export const handleEditMessage = (socket: Socket) => {
  socket.on(
    'edit-message',
    async (data: EditMessageType, ack: (ack: boolean) => void) => {
      try {
        const messRepo = new messageRepo();
        const conRepo = new conversationRepo();

        const receiversId = await editMessageHelper(
          data,
          messRepo,
          conRepo,
          socket.user?.id as string
        );
        if (typeof ack === 'function') ack(true);

        // Emit the message to the receiver
        receiversId.forEach(async (receiverId) => {
          await emitWithQueueServer({
            userId: receiverId,
            event: 'edit-message-update',
            data: data,
            isDirect: true,
          });
        });
      } catch (err) {
        console.log(err);
        if (typeof ack === 'function') ack(false);
      }
    }
  );
};
