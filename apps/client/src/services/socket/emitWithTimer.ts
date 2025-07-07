import { EventEmitType } from '@bro/shared';
import { getSocket } from '@client/configs/socket';

export const emitWithTimer = async ({ event, data }: EventEmitType) => {
  const socket = getSocket();

  if (!socket?.connected || !navigator.onLine) {
    return;
  }

  const ackReceived = await new Promise<boolean>((resolve) => {
    let isAcked = false;

    const timeout = setTimeout(() => {
      if (!isAcked) resolve(false);
    }, 5000);

    socket.emit(event, data, (ack: boolean) => {
      isAcked = true;
      clearTimeout(timeout);
      resolve(ack);
    });
  });

  return ackReceived;
};
