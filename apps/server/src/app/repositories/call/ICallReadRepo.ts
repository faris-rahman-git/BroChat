import { callListType } from '@bro/shared';

export interface ICallReadRepo {
  findCallReceivers(roomId: string): Promise<string[]>;

  findAllCallList(userId: string): Promise<callListType[]>;

  findCallStarted(roomId: string): Promise<boolean>
  findCallEnded(roomId: string): Promise<boolean>
}
