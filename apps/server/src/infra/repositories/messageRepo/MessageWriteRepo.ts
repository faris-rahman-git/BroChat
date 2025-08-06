import messageModel from '../../databases/mongo/db/messageModel';
import { IMessageWriteRepo } from '../../../app/repositories/message/IMessageWriteRepo';
import { Types } from 'mongoose';
import { MessageType, MessageStatusType } from '@bro/shared';

export class MessageWriteRepo implements IMessageWriteRepo {
  async save(data: MessageType, receiversId: string[]): Promise<MessageType> {
    const result = await messageModel.create({
      ...data,
      recipients: receiversId,
      status: 'sent',
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
      deliveredBy:
        message.deliveredBy?.map((entry: any) => ({
          userId: entry.userId.toString(),
          time: entry.time,
        })) || [],
      readBy:
        message.readBy?.map((entry: any) => ({
          userId: entry.userId.toString(),
          time: entry.time,
        })) || [],
      status: message.status,
      messageTime: message.messageTime,
      createdAt: message.createdAt,
    };
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
}
