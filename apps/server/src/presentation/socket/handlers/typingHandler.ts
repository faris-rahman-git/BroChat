import { Socket } from 'socket.io';
import { socketAdapter } from '../../adapters/socketAdapter';
import { startTypingComposer } from '../../../infra/services/socketComposers/typing/startTypingComposer';
import { stopTypingComposer } from '../../../infra/services/socketComposers/typing/stopTypingComposer';

export const typingHandler = (socket: Socket) => {
  socket.on(
    'start-typing',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, startTypingComposer())
  );

  socket.on(
    'stop-typing',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, stopTypingComposer())
  );
};
