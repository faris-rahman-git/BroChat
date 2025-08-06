import { Socket } from 'socket.io';
import { socketAdapter } from '../../adapters/socketAdapter';
import { userConnectedComposer } from '../../../infra/services/socketComposers/connection/userConnectedComposer';
import { disconnectComposer } from '../../../infra/services/socketComposers/connection/disconnectComposer';

export const connectionHandler = (socket: Socket) => {
  socket.on(
    'user-connected',
    async (data) =>
      await socketAdapter(socket, data, undefined, userConnectedComposer())
  );

  socket.on(
    'disconnect',
    async () =>
      await socketAdapter(socket, undefined, undefined, disconnectComposer())
  );
};
