import { Server } from 'socket.io';
import { authSocket } from './middlewares/authSocket';
import { messageHandler } from './handlers/messageHandler';
import { connectionHandler } from './handlers/connectionHandler';
import { typingHandler } from './handlers/typingHandler';

export function setupSocket(io: Server) {
  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    connectionHandler(socket);
    messageHandler(socket);
    typingHandler(socket);
  });
}
