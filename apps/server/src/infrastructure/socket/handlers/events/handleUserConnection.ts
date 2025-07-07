import { Socket } from 'socket.io';
import { addUserToRedis } from '../../../services/socketServices/addUserToRedis';
import { processServerOfflineQueue } from '../offlineQueue/processServerOfflineQueue';
import { notifyOnlineOfllineUsers } from './notifyOnlineOfllineUsers';

export const handleUserConnection = (socket: Socket) => {
  socket.on('user-connected', async (userId: string) => {
    try {
      if (!userId) return;
      console.log('User connected:', userId);
      await addUserToRedis(socket.id, userId);

      await processServerOfflineQueue(userId);

      await notifyOnlineOfllineUsers(userId, true);
    } catch (err) {
      console.log(err);
    }
  });
};
