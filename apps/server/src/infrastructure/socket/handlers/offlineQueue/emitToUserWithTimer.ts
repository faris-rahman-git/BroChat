import { EmitOptions } from '../../../../domain/entities/socketTypes/offlineQueueType';
import { io } from '../../../../main';

export const emitToUserWithTimer = async ({
  socketId,
  event,
  data,
}: Omit<EmitOptions & { socketId: string }, 'userId'>) => {
  const targetSocket = io.sockets.sockets.get(socketId);
  if (!targetSocket) return false;

  const ackReceived = new Promise<boolean>((resolve) => {
    let isAcked = false;

    // Start a timeout
    const timeout = setTimeout(() => {
      if (!isAcked) resolve(false);
    }, 5000);

    targetSocket.emit(event, data, (ack: boolean) => {
      isAcked = true;
      clearTimeout(timeout);
      resolve(ack);
    });
  });

  return ackReceived;
};
