// presentation/socket/socketAdapter.ts
import { Socket } from 'socket.io';
import { SocketRequest } from '../socket/socketHelper/implementations/SocketRequest';
import { ISocketRequest } from '../socket/socketHelper/ISocketRequest';
import { ISocketController } from '../../app/providers/controller/ISocketController';

export const socketAdapter = async (
  socket: Socket,
  data: any,
  ack: Function | undefined,
  controller: ISocketController
) => {
  const socketRequest: ISocketRequest = new SocketRequest({
    socketId: socket.id,
    user: socket.user,
    body: data,
  });

  const result = await controller.handle(socketRequest);
  if (ack && typeof ack === 'function') ack(result);
};
