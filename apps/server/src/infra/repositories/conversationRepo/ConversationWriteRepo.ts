import conversationModel from '../../databases/mongo/db/conversationModel';
import { IConversationWriteRepo } from '../../../app/repositories/conversation/IConversationWriteRepo';
import { CreateGroupType } from '../../../domain/entity/user/ConversationRepoTypes';
import { updateGroupInfoType } from '@bro/shared';

export class ConversationWriteRepo implements IConversationWriteRepo {
  async createNewConversation(
    userId: string,
    receiverId: string
  ): Promise<string> {
    const conversation = await conversationModel.create({
      participants: [userId, receiverId],
    });

    const { _id } = conversation.toObject();
    return _id.toString();
  }

  async createNewGroup(
    userId: string,
    groupName: string,
    groupMembers: string[],
    groupAvatarUrl: string
  ): Promise<CreateGroupType> {
    const conversation = await conversationModel.create({
      participants: [...groupMembers, userId],
      Admins: [userId],
      isGroup: true,
      groupName,
      avatar: groupAvatarUrl,
      createdBy: userId,
    });

    const { _id, createdAt } = conversation.toObject();
    return {
      _id: _id.toString(),
      createdAt,
    };
  }

  async removeGroupMember(
    conversationId: string,
    memberId: string
  ): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $pull: { participants: memberId, Admins: memberId } }
    );
  }

  async makeGroupAdmin(
    conversationId: string,
    memberId: string
  ): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $addToSet: { Admins: memberId } }
    );
  }

  async dismissGroupAdmin(
    conversationId: string,
    memberId: string
  ): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $pull: { Admins: memberId } }
    );
  }

  async addMoreParticipants(
    conversationId: string,
    newMembersId: string[]
  ): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $addToSet: { participants: { $each: newMembersId } } }
    );
  }

  async updateGroupInfo(
    conversationId: string,
    groupInfo: updateGroupInfoType
  ): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      { $set: { ...groupInfo } }
    );
  }

  async updatePaidStatus(conversationId: string): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId, isGroup: true },
      { $set: { isPaid: true } }
    );
  }

  async updateBlockStatus(
    conversationId: string,
    isBlocked: boolean
  ): Promise<void> {
    await conversationModel.findByIdAndUpdate(conversationId, {
      isBlocked,
      blockedAt: isBlocked ? Date.now() : null,
    });
  }
}
