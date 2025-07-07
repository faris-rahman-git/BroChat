import { Types } from 'mongoose';
import { iMessageRepo } from '../../application/interfaces/iMessageRepo';
import messageModel from '../database/messageModel';
import { MessageType } from '@bro/shared';

export class messageRepo implements iMessageRepo {
  
  async findByTempId(tempId: string): Promise<Types.ObjectId | null> {
    const result = await messageModel.findOne({ tempId }, { _id: 1 }).lean();
    return result?._id ?? null;
  }

  async save(data: MessageType): Promise<MessageType> {
    const message = await messageModel.create(data);
    const {
      _id,
      conversationId,
      senderId,
      MessageType,
      content,
      mediaUrl,
      deliveredBy,
      readBy,
      status,
      messageTime,
      createdAt,
    } = message.toObject();

    return {
      _id: _id.toString(),
      conversationId: conversationId.toString(),
      senderId: senderId.toString(),
      MessageType,
      content,
      mediaUrl,
      deliveredBy,
      readBy,
      status,
      messageTime,
      createdAt,
    };
  }

  async findMessages(conversationId: string): Promise<MessageType[]> {
    return await messageModel
      .find(
        { conversationId },
        {
          _id: 1,
          conversationId: 1,
          senderId: 1,
          MessageType: 1,
          content: 1,
          mediaUrl: 1,
          deliveredBy: 1,
          readBy: 1,
          status: 1,
          messageTime: 1,
          createdAt: 1,
        }
      )
      .sort({ messageTime: 1 });
  }

  async updateMessageStatus(messageId: string, status: string): Promise<void> {
    await messageModel.updateOne(
      { _id: messageId },
      { $set: { status: status } }
    );
  }
}
