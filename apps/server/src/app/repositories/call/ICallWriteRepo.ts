import { CallInvite } from '@bro/shared';

export interface ICallWriteRepo {
  saveCall(
    userId: string,
    data: CallInvite,
    receiverIds: string[]
  ): Promise<void>;
  acceptCall(roomId: string, userId: string, joinedAt: Date): Promise<void>;

  rejectCall(userId: string, roomId: string): Promise<string>;

  callLeft(roomId: string, leftAt: Date, userId: string): Promise<void>;

  callEnd(roomId: string, endedAt: Date): Promise<void>;
}
