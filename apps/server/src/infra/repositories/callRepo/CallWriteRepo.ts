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
      roomId: data.roomId,
      isVideoCall: data.isVideoCall,
      isGroupCall: data.isGroupCall,
      initiatedAt: data.initiatedAt,
      caller: {
        userId,
      },
      receivers: receiverIds.map((receiverId) => ({
        userId: receiverId,
      })),
    });
  }

  async startACall(roomId: string, startedAt: Date): Promise<void> {
    await callModel.updateOne(
      { roomId },
      { $set: { startedAt, 'caller.joinedAt': startedAt } }
    );
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

    return result.caller!.userId.toString();
  }

  async callLeft(roomId: string, leftAt: Date, userId: string): Promise<void> {
    console.log('check left at: 1', userId);

    const objectId = new Types.ObjectId(userId);

    const call = await callModel.findOne(
      { roomId, 'receivers.userId': objectId },
      { 'receivers.$': 1, caller: 1 }
    );

    if (call && call.receivers?.length) {
      // User is a receiver
      const joinedAt = call.receivers[0].joinedAt;
      const leftAtDate = new Date(leftAt);
      const duration = joinedAt ? leftAtDate.getTime() - joinedAt.getTime() : 0;

      await callModel.updateOne(
        { roomId, 'receivers.userId': objectId },
        {
          $set: {
            'receivers.$.leftAt': leftAt,
            'receivers.$.duration': duration,
          },
        }
      );
      return;
    }

    const callerCall = await callModel.findOne(
      { roomId, 'caller.userId': userId },
      { caller: 1 }
    );

    console.log('==== check left at: 2 ====', callerCall);

    if (callerCall && callerCall.caller) {
      const joinedAt = callerCall.caller.joinedAt;
      const leftAtDate = new Date(leftAt);
      const duration = joinedAt ? leftAtDate.getTime() - joinedAt.getTime() : 0;

      await callModel.updateOne(
        { roomId, 'caller.userId': userId },
        {
          $set: {
            'caller.leftAt': leftAt,
            'caller.duration': duration,
          },
        }
      );
      return;
    }
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
