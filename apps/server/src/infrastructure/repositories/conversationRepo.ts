import {
  GroupChatListType,
  GroupMember,
  updateGroupInfoType,
} from '@bro/shared';
import { iConversationRepo } from '../../application/interfaces/iConversationRepo';
import {
  CheckConversationExistsType,
  FindReceiverIdType,
} from '../../domain/entities/conversationTypes';
import { CreateGroupType, usersList } from '../../domain/entities/homeTypes';
import conversationModel from '../database/conversationModel';

export class conversationRepo implements iConversationRepo {
  async findDMs(userId: string): Promise<usersList[]> {
    return (await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 1, participants: 1, createdAt: 1 }
      )
      .populate(
        'participants',
        '_id name avatar username email phoneNumber about blockedUsers blockedByUsers'
      )
      .lean()) as unknown as usersList[];
  }
  async findGroups(userId: string): Promise<GroupChatListType[]> {
    const groups = await conversationModel
      .find({ participants: userId, isGroup: true }, { isGroup: 0 })
      .populate('participants', '_id name avatar username')
      .lean();

    return groups.map((group) => ({
      _id: String(group._id),
      participants: (group.participants as unknown as GroupMember[]).map(
        (p: any) => ({
          _id: String(p._id),
          name: p.name,
          avatar: p.avatar,
          username: p.username,
        })
      ),
      Admins: group.Admins.map((id: any) => String(id)),
      groupName: group.groupName,
      about: group.about,
      createdAt: group.createdAt,
      createdBy: String(group.createdBy),
      avatar: group.avatar ?? undefined,
    }));
  }

  async findDMsIds(userId: string): Promise<string[]> {
    const conversations = await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 0, participants: 1 }
      )
      .lean();

    const result: string[] = [];
    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find(
        (id) => id.toString() !== userId
      );
      if (otherParticipant) {
        result.push(otherParticipant.toString());
      }
    });

    return result;
  }

  async findReceiverId(conversationId: string): Promise<FindReceiverIdType> {
    return (await conversationModel.findOne(
      { _id: conversationId },
      { _id: 0, participants: 1 }
    ))!;
  }

  async checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<CheckConversationExistsType | null> {
    return await conversationModel.findOne(
      {
        isGroup: false,
        participants: { $all: [userId, receiverId], $size: 2 },
      },
      {
        _id: 1,
      }
    );
  }

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

  async findGroupAdminIds(conversationId: string): Promise<string[]> {
    const result = await conversationModel.findOne(
      { _id: conversationId },
      { _id: 0, Admins: 1 }
    );

    return result!.Admins.map((id) => String(id));
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
      { $push: { Admins: memberId } }
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
      { $push: { participants: { $each: newMembersId } } }
    );
  }

  async findConversationById(
    conversationId: string
  ): Promise<GroupChatListType> {
    const result = (await conversationModel
      .findOne({ _id: conversationId })
      .populate('participants', '_id name avatar username')
      .lean())!;

    return {
      _id: result._id.toString(),
      participants: result.participants.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        avatar: p.avatar,
        username: p.username,
      })),
      Admins: result.Admins.map((id: any) => String(id)),
      groupName: result.groupName,
      about: result.about,
      createdAt: result.createdAt,
      createdBy: String(result.createdBy),
      avatar: result.avatar ?? undefined,
    };
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
}
