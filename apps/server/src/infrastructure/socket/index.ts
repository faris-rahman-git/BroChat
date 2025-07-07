import { Server } from 'socket.io';
import { authSocket } from '../middlewares/auth/authSocket';
import { handleConnection } from './handlers/handleConnection';

export function setupSocket(io: Server) {
  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    handleConnection(socket);
  });
}
