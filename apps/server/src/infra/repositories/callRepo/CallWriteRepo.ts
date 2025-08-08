import { CallInvite } from '../../../../../../libs/shared/src/lib/types/home/callTypes';
import { ICallWriteRepo } from '../../../app/repositories/call/ICallWriteRepo';
import callModel from '../../databases/mongo/db/callModel';

export class CallWriteRepo implements ICallWriteRepo {
  async saveCall(
    userId: string,
    data: CallInvite,
    receiverIds: string[]
  ): Promise<void> {
    await callModel.create({
      conversationId: data.conversationId,
      callerId: userId,
      roomId: data.roomId,
      isVideoCall: data.isVideoCall,
      startedAt: data.startedAt,
      receivers: receiverIds.map((receiverId) => ({
        userId: receiverId,
      })),
    });
  }
}
