import { Socket } from 'socket.io';
import { handleUserConnection } from '../../infrastructure/socket/handlers/events/handleUserConnection';
import { handleMessage } from '../../infrastructure/socket/handlers/events/handleMessage';
import { handleEditMessage } from '../../infrastructure/socket/handlers/events/handleEditMessage';
import { handleMessageStatusDelivered } from '../../infrastructure/socket/handlers/events/handleMessageStatusDelivered';
import { handleTyping } from '../../infrastructure/socket/handlers/events/handleTyping';
import { handleDisconnect } from '../../infrastructure/socket/handlers/events/handleDisconnect';

export const handleConnection = async (socket: Socket) => {
  handleUserConnection(socket);

  handleMessage(socket);

  handleEditMessage(socket);

  handleMessageStatusDelivered(socket);

  handleTyping(socket);

  handleDisconnect(socket);
};
