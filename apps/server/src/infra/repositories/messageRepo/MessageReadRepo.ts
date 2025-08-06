import messageModel from '../../databases/mongo/db/messageModel';
import { IMessageReadRepo } from '../../../app/repositories/message/IMessageReadRepo';
import { MessageType } from '@bro/shared';
import { Types } from 'mongoose';

export class MessageReadRepo implements IMessageReadRepo {
  async findByTempId(tempId: string): Promise<string | null> {
    const result = await messageModel.findOne({ tempId }, { _id: 1 }).lean();
    return result?._id.toString() ?? null;
  }

  async findMessages(
    conversationId: string,
    userId: string
  ): Promise<MessageType[]> {
    return await messageModel.aggregate([
      {
        $match: {
          conversationId: new Types.ObjectId(conversationId),
          deletedBy: { $nin: [new Types.ObjectId(userId)] },
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          deliveredBy: {
            $map: {
              input: '$deliveredBy',
              as: 'item',
              in: {
                userId: { $toString: '$$item.userId' },
                time: '$$item.time',
              },
            },
          },
          readBy: {
            $map: {
              input: '$readBy',
              as: 'item',
              in: {
                userId: { $toString: '$$item.userId' },
                time: '$$item.time',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          conversationId: { $toString: '$conversationId' },
          senderId: { $toString: '$senderId' },
          senderName: '$sender.name',
          senderAvatar: '$sender.avatar',
          MessageType: 1,
          content: 1,
          mediaUrl: 1,
          deliveredBy: 1,
          isEdited: 1,
          readBy: 1,
          status: 1,
          messageTime: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { messageTime: 1 },
      },
    ]);
  }

  async findMessageCreatedAt(messageId: string): Promise<string | Date> {
    const result = await messageModel
      .findOne({ _id: messageId }, { createdAt: 1 })
      .lean();

    return result!.createdAt;
  }
}
