import { Types } from 'mongoose';
import callModel from '../../databases/mongo/db/callModel';
import { ICallWriteRepo } from '../../../app/repositories/call/ICallWriteRepo';
import { CallInvite } from '@bro/shared';

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
      isGroupCall: data.isGroupCall,
      startedAt: data.startedAt,
      receivers: receiverIds.map((receiverId) => {
        if (receiverId === userId) {
          return {
            userId: receiverId,
            status: 'accepted',
            joinedAt: data.startedAt,
          };
        } else {
          return {
            userId: receiverId,
          };
        }
      }),
    });
  }

  async acceptCall(
    roomId: string,
    userId: string,
    joinedAt: Date
  ): Promise<void> {
    await callModel.updateOne(
      { roomId, 'receivers.userId': new Types.ObjectId(userId) },
      {
        $set: {
          'receivers.$.status': 'accepted',
          'receivers.$.joinedAt': joinedAt,
        },
      }
    );
  }

  async rejectCall(userId: string, roomId: string): Promise<string> {
    const result = (await callModel.findOneAndUpdate(
      { 'receivers.userId': new Types.ObjectId(userId), roomId },
      {
        $set: {
          'receivers.$.status': 'rejected',
        },
      }
    ))!;

    return result.callerId.toString();
  }

  async callLeft(roomId: string, leftAt: Date, userId: string): Promise<void> {
    const call = await callModel.findOne(
      { roomId, 'receivers.userId': new Types.ObjectId(userId) },
      { 'receivers.$': 1 }
    );

    if (!call || !call.receivers?.length) return;

    const joinedAt = call.receivers[0].joinedAt;
    const leftAtDate = new Date(leftAt);
    const duration = joinedAt ? leftAtDate.getTime() - joinedAt.getTime() : 0;

    await callModel.updateOne(
      { roomId, 'receivers.userId': new Types.ObjectId(userId) },
      {
        $set: {
          'receivers.$.leftAt': leftAt,
          'receivers.$.duration': duration,
        },
      }
    );
  }

  async callEnd(roomId: string, endedAt: Date): Promise<void> {
    const call = await callModel.findOne({ roomId }, { startedAt: 1 });

    if (!call) return;

    const startedAt = call.startedAt;
    const endedAtDate = new Date(endedAt);
    const duration = startedAt
      ? endedAtDate.getTime() - startedAt.getTime()
      : 0;

    await callModel.updateOne(
      { roomId },
      {
        $set: {
          endedAt: endedAt,
          duration: duration,
        },
      }
    );
  }
}
