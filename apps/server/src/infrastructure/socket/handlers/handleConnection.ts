import { Socket } from 'socket.io';
import { handleDisconnect } from './events/handleDisconnect';
import { handleUserConnection } from './events/handleUserConnection';
import { handleMessage } from './events/handleMessage';
import { handleMessageStatusDelivered } from './events/handleMessageStatusDelivered';
import { handleTyping } from './events/handleTyping';

export const handleConnection = async (socket: Socket) => {
  handleUserConnection(socket);

  handleMessage(socket);

  handleMessageStatusDelivered(socket);

  handleTyping(socket);

  handleDisconnect(socket);
};
