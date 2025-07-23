import { Server } from 'socket.io';
import { authSocket } from '../../infrastructure/middlewares/auth/authSocket';
import { handleConnection } from './handleConnection';

export function setupSocket(io: Server) {
  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    handleConnection(socket);
  });
}
