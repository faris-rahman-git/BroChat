import { getSocketIdByUserId } from '../../../infrastructure/services/socketServices/getReceiverSocketId';
import { removeUserBySocketId } from '../../../infrastructure/services/socketServices/removeUserBySocketId';
import { notifyOnlineOfllineUsers } from '../../../infrastructure/socket/handlers/events/notifyOnlineOfllineUsers';
import { io } from '../../../main';

export const disconnectSocket = async (userId: string) => {
  const socketId = await getSocketIdByUserId(userId);
  if (socketId) {
    await removeUserBySocketId(socketId);
    console.log(`Socket disconnected: ${socketId} (user: ${userId})`);
    await notifyOnlineOfllineUsers(userId as string, false);
    io.to(socketId).disconnectSockets(true);
  }
};
