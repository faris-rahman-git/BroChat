import { ICallReadRepo } from '../../../app/repositories/call/ICallReadRepo';
import callModel from '../../databases/mongo/db/callModel';
import { callListType } from '@bro/shared';

export class CallReadRepo implements ICallReadRepo {
  async findCallReceivers(roomId: string): Promise<string[]> {
    const call = await callModel.findOne({ roomId }, { receivers: 1, _id: 0 });
    if (!call) return [];
    return call.receivers.map((receiver) => receiver.userId.toString());
  }

  async findAllCallList(userId: string): Promise<callListType[]> {
    const result = await callModel
      .find({ 'receivers.userId': userId })
      .populate('callerId', '_id name avatar username')
      .populate('receivers.userId', '_id name avatar username')
      .lean();

    return result.map((call: any) => ({
      conversationId: String(call.conversationId),
      callerId: {
        _id: String(call.callerId._id),
        name: call.callerId.name,
        avatar: call.callerId.avatar,
        username: call.callerId.username,
      },
      roomId: call.roomId,
      receivers: call.receivers.map((r: any) => ({
        status: r.status,
        joinedAt: r.joinedAt,
        leftAt: r.leftAt,
        duration: r.duration,
        userId: {
          _id: String(r.userId._id),
          name: r.userId.name,
          avatar: r.userId.avatar,
          username: r.userId.username,
        },
      })),
      isVideoCall: call.isVideoCall,
      isGroupCall: call.isGroupCall,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.duration,
    }));
  }
}
