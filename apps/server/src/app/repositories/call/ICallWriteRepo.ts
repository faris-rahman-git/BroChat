import { CallInvite } from '@bro/shared';

export interface ICallWriteRepo {
  saveCall(userId: string, data: CallInvite , receiverIds: string[]): Promise<void>;
}
