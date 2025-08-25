import messageModel from '../../databases/mongo/db/messageModel';
import { IMessageDeleteRepo } from '../../../app/repositories/message/IMessageDeleteRepo';

export class MessageDeleteRepo implements IMessageDeleteRepo {
  async deleteMessageForUser(
    messageIds: string[],
    userId: string
  ): Promise<void> {
    await messageModel.updateMany(
      { _id: { $in: messageIds } },
      { $push: { deletedBy: userId } }
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    await messageModel.deleteOne({ _id: messageId });
  }

  async deleteMessageBySenderId(senderId: string): Promise<void> {
    await messageModel.deleteMany({ senderId });
  }

  async removeReaction(messageId: string, userId: string): Promise<void> {
    const msg = (await messageModel.findById(messageId)) as any;
    if (msg) {
      msg.reactions = msg.reactions?.filter(
        (r: any) => r.userId.toString() !== userId
      );
      await msg.save();
    }
  }
}
