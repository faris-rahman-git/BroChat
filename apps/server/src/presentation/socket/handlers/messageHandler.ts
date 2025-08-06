import { Socket } from 'socket.io';
import { socketAdapter } from '../../adapters/socketAdapter';
import { sendMessageComposer } from '../../../infra/services/socketComposers/message/sendMessageComposer';
import { editMessageComposer } from '../../../infra/services/socketComposers/message/editMessageComposer';
import { statusUpdateComposer } from '../../../infra/services/socketComposers/message/statusUpdateComposer';

export const messageHandler = (socket: Socket) => {
  socket.on(
    'send-message',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, sendMessageComposer())
  );

  socket.on(
    'edit-message',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, editMessageComposer())
  );

  socket.on(
    'message-status-updated',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, statusUpdateComposer())
  );
};
