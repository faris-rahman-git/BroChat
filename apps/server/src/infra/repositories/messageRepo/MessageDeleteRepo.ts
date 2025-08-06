import messageModel from '../../databases/mongo/db/messageModel';
import { IMessageDeleteRepo } from '../../../app/repositories/message/IMessageDeleteRepo';

export class MessageDeleteRepo implements IMessageDeleteRepo {
  async deleteMessageForUser(messageId: string, userId: string): Promise<void> {
    await messageModel.updateOne(
      { _id: messageId },
      { $push: { deletedBy: userId } }
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    await messageModel.deleteOne({ _id: messageId });
  }

  async deleteMessageBySenderId(senderId: string): Promise<void> {
    await messageModel.deleteMany({ senderId });
  }
}
