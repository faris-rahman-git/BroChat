import { Types } from 'mongoose';
import { iMessageRepo } from '../../application/interfaces/iMessageRepo';
import messageModel from '../database/messageModel';
import { MessageStatusType, MessageType } from '@bro/shared';

export class messageRepo implements iMessageRepo {
  async findByTempId(tempId: string): Promise<Types.ObjectId | null> {
    const result = await messageModel.findOne({ tempId }, { _id: 1 }).lean();
    return result?._id ?? null;
  }

  async save(data: MessageType, receiversId: string[]): Promise<MessageType> {
    const result = await messageModel.create({
      ...data,
      recipients: receiversId,
    });

    const message = (await messageModel
      .findById(result._id)
      .populate('senderId', 'name avatar'))!;

    const sender = message.senderId as any;

    return {
      _id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: sender._id.toString(),
      senderName: sender.name,
      senderAvatar: sender.avatar,
      MessageType: message.MessageType,
      content: message.content,
      mediaUrl: message.mediaUrl,
      deliveredBy: message.deliveredBy,
      readBy: message.readBy,
      status: message.status,
      messageTime: message.messageTime,
      createdAt: message.createdAt,
    };
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
        $project: {
          _id: 1,
          conversationId: 1,
          senderId: 1,
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

  async updateMessageStatus(
    messageId: string,
    receiverId: string,
    status: MessageStatusType
  ): Promise<MessageStatusType | null> {
    const message = await messageModel.findById(messageId);
    if (!message) return null;

    const receiverObjectId = new Types.ObjectId(receiverId);

    // Step 1: Update deliveredBy or readBy
    if (status === 'delivered') {
      await messageModel.updateOne(
        { _id: messageId, 'deliveredBy.userId': { $ne: receiverObjectId } },
        {
          $addToSet: {
            deliveredBy: {
              userId: receiverObjectId,
              time: new Date(),
            },
          },
        }
      );
    }
    if (status === 'seen') {
      await messageModel.updateOne(
        { _id: messageId, 'readBy.userId': { $ne: receiverObjectId } },
        {
          $addToSet: {
            readBy: {
              userId: receiverObjectId,
              time: new Date(),
            },
          },
        }
      );
    }

    // Step 2: Fetch updated message to compare
    const updatedMessage = await messageModel.findById(messageId);
    const recipients = updatedMessage!.recipients.map((id: any) =>
      id.toString()
    );
    const delivered = updatedMessage!.deliveredBy.map((d: any) =>
      d.userId.toString()
    );
    const seen = updatedMessage!.readBy.map((r: any) => r.userId.toString());

    // Step 3: Update status if all users have the update
    if (
      status === 'delivered' &&
      recipients.every((id) => delivered.includes(id)) &&
      updatedMessage!.status !== 'delivered'
    ) {
      await messageModel.updateOne(
        { _id: messageId },
        { $set: { status: 'delivered' } }
      );
      return 'delivered';
    }

    if (
      status === 'seen' &&
      recipients.every((id) => seen.includes(id)) &&
      updatedMessage!.status !== 'seen'
    ) {
      await messageModel.updateOne(
        { _id: messageId },
        { $set: { status: 'seen' } }
      );
      return 'seen';
    }

    return null;
  }

  async deleteMessageForUser(messageId: string, userId: string): Promise<void> {
    await messageModel.updateOne(
      { _id: messageId },
      { $push: { deletedBy: userId } }
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    await messageModel.deleteOne({ _id: messageId });
  }

  async editMessage(
    messageId: string,
    message: string,
    senderId: string
  ): Promise<void> {
    await messageModel.updateOne(
      { _id: messageId, senderId },
      { $set: { content: message, isEdited: true } }
    );
  }
}
