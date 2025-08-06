import { IConversationDeleteRepo } from '../../../app/repositories/conversation/IConversationDeleteRepo';
import conversationModel from '../../databases/mongo/db/conversationModel';

export class ConversationDeleteRepo implements IConversationDeleteRepo {
  async deleteAllOneToOneConversationByuserId(userId: string): Promise<void> {
    await conversationModel.deleteMany({
      participants: userId,
      isGroup: false,
    });
  }

  async removeUserFromAllGroups(userId: string): Promise<void> {
    const groups = await conversationModel.find({
      participants: userId,
      isGroup: true,
    });

    for (const group of groups) {
      const isOnlyAdmin =
        group.Admins.length === 1 && group.Admins[0].toString() === userId;

      if (isOnlyAdmin) {
        // Remove the user from participants and Admins
        group.participants = group.participants.filter(
          (p: any) => p.toString() !== userId
        );
        group.Admins = [];

        if (group.participants.length === 0) {
          // No one left in the group, delete it
          await conversationModel.deleteOne({ _id: group._id });
          continue;
        }

        // Assign a new admin (e.g., the first remaining participant)
        group.Admins.push(group.participants[0]);
        await group.save();
      } else {
        // Just remove the user from both arrays
        await conversationModel.updateOne(
          { _id: group._id },
          {
            $pull: { participants: userId, Admins: userId },
          }
        );
      }
    }
  }

  async softDeleteAConversation(conversationId: string): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
  }

  async updateSoftDeleteStatus(
    conversationId: string,
    isDeleted: boolean
  ): Promise<void> {
    await conversationModel.findByIdAndUpdate(conversationId, {
      isDeleted,
      deletedAt: isDeleted ? Date.now() : null,
    });
  }

  async hardDeleteAConversation(conversationId: string): Promise<void> {
    await conversationModel.deleteOne({ _id: conversationId });
  }
}
