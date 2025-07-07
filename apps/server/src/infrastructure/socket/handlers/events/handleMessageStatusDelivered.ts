import { messageRepo } from '../../../repositories/messageRepo';
import { updateMessageStatus } from '../../../../application/useCases/socket/updateMessageStatus';
import { Socket } from 'socket.io';
import { MessageStatusType } from '@bro/shared';

export const handleMessageStatusDelivered = async (socket: Socket) => {
  socket.on(
    'message-status-updated',
    async (
      data: { messageId: string; senderId: string; status: MessageStatusType },
      ack: (ack: boolean) => void
    ) => {
      try {
        const messRepo = new messageRepo();
        await updateMessageStatus(
          data.messageId,
          data.senderId,
          messRepo,
          data.status
        );
        if (typeof ack === 'function') ack(true);
      } catch (err) {
        console.error(err);
        if (typeof ack === 'function') ack(false);
      }
    }
  );
};
