import { getSocket } from '@client/configs/socket';
import { EventEmitType } from '@bro/shared';
import { emitWithTimer } from '@client/services/socket/emitWithTimer';
import { startQueueProcessor } from '@client/services/socket/startQueueProcessor';
import { optimizeAndQueue } from './optimizeAndQueue';

export const emitWithQueue = async ({ event, data }: EventEmitType) => {
  const socket = getSocket();

  if (!socket?.connected || !navigator.onLine) {
    optimizeAndQueue({ event, data });
    return;
  }

  const ackReceived = await emitWithTimer({ event, data });


  if (!ackReceived) {
    optimizeAndQueue({ event, data });
    await startQueueProcessor();
  }
};
