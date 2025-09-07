import { ICallReadRepo } from '../../../app/repositories/call/ICallReadRepo';
import callModel from '../../databases/mongo/db/callModel';
import { callListType } from '@bro/shared';
import { ICallDocumentPopulated } from '../../types/callDocument';

export class CallReadRepo implements ICallReadRepo {
  async findCallReceivers(roomId: string): Promise<string[]> {
    const call = await callModel.findOne({ roomId }, { receivers: 1, _id: 0 });
    if (!call) return [];
    return call.receivers.map((receiver) => receiver.userId.toString());
  }

  async findAllCallList(userId: string): Promise<callListType[]> {
    const result = (await callModel
      .find({
        $or: [{ 'caller.userId': userId }, { 'receivers.userId': userId }],
      })
      .populate('caller.userId', '_id name avatar username')
      .populate('receivers.userId', '_id name avatar username')
      .lean()) as unknown as ICallDocumentPopulated[];

    return result.map((call) => ({
      conversationId: String(call.conversationId),
      callerId: {
        _id: String(call.caller.userId._id),
        name: call.caller.userId.name,
        avatar: call.caller.userId.avatar,
        username: call.caller.userId.username,
      },
      roomId: call.roomId,
      receivers: call.receivers.map((r) => ({
        status: r.status,
        joinedAt: r.joinedAt,
        leftAt: r.leftAt,
        duration: r.duration,
        userId: r.userId
          ? {
              _id: String(r.userId._id),
              name: r.userId.name,
              avatar: r.userId.avatar,
              username: r.userId.username,
            }
          : null,
      })),
      isVideoCall: call.isVideoCall,
      isGroupCall: call.isGroupCall,
      initiatedAt: call.initiatedAt,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.duration,
    })) as callListType[];
  }

  async findCallStarted(roomId: string): Promise<boolean> {
    const result = await callModel
      .findOne({ roomId }, { startedAt: 1, _id: 0 })
      .lean();

    if (!result) return false;

    return !!result.startedAt;
  }

  async findCallEnded(roomId: string): Promise<boolean> {
    const result = await callModel
      .findOne({ roomId }, { endedAt: 1, _id: 0 })
      .lean();
    if (!result) return false;
    return !!result.endedAt;
  }
}
