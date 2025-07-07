import { Socket } from 'socket.io';
import { removeUserBySocketId } from '../../../services/socketServices/removeUserBySocketId';
import { notifyOnlineOfllineUsers } from './notifyOnlineOfllineUsers';

export const handleDisconnect = (socket: Socket) => {
  socket.on('disconnect', async () => {
    const userId = await removeUserBySocketId(socket.id);
    console.log(`Socket disconnected: ${socket.id} (user: ${userId})`);
    await notifyOnlineOfllineUsers(userId as string, false);
  });
};
