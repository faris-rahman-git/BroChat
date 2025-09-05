import { Server } from 'socket.io';
import { authSocket } from './middlewares/authSocket';
import { messageHandler } from './handlers/messageHandler';
import { connectionHandler } from './handlers/connectionHandler';
import { typingHandler } from './handlers/typingHandler';
import { callHandler } from './handlers/callHandler';

export function setupSocket(io: Server) {
  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    connectionHandler(socket);
    messageHandler(socket);
    typingHandler(socket);
    callHandler(socket);

    socket.emit('custom-ping', { time: new Date().toISOString() });

    socket.on('custom-pong', (data) => {
      console.log('📡 pong from client:', data);
    });
  });
}
