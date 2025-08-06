import conversationModel from '../../databases/mongo/db/conversationModel';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';

import { usersList } from '../../../domain/dtos/user/ConversationRepoTypes';
import {
  DeleteGroupsReturnType,
  GroupChatListType,
  GroupChatType,
} from '@bro/shared';

export class ConversationReadRepo implements IConversationReadRepo {
  async findDMs(userId: string): Promise<usersList[]> {
    const result = await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 1, participants: 1, createdAt: 1 }
      )
      .populate(
        'participants',
        '_id name avatar username email phoneNumber about blockedUsers blockedByUsers createdAt isSubscribed'
      )
      .lean();

    return result.map((c) => ({
      _id: String(c._id),
      createdAt: c.createdAt,
      participants: c.participants.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        avatar: p.avatar,
        username: p.username,
        email: p.email,
        phoneNumber: p.phoneNumber,
        about: p.about,
        createdAt: p.createdAt,
        isSubscribed: p.isSubscribed,
        blockedUsers: (p.blockedUsers ?? []).map((id: any) => String(id)),
        blockedByUsers: (p.blockedByUsers ?? []).map((id: any) => String(id)),
      })),
    }));
  }

  async findGroups(userId: string): Promise<GroupChatListType[]> {
    const groups = await conversationModel
      .find(
        { participants: userId, isGroup: true, isDeleted: false },
        { isGroup: 0 }
      )
      .populate('participants', '_id name avatar username')
      .lean();

    return groups.map((group) => ({
      _id: String(group._id),
      participants: group.participants.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        avatar: p.avatar,
        username: p.username,
      })),
      Admins: group.Admins.map((id) => String(id)),
      groupName: group.groupName,
      about: group.about,
      createdAt: group.createdAt,
      createdBy: String(group.createdBy),
      avatar: group.avatar,
      isPaid: group.isPaid,
      isBlocked: group.isBlocked,
      blockedAt: group.blockedAt,
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

  async findReceiverId(conversationId: string): Promise<string[]> {
    const result = (await conversationModel.findOne(
      { _id: conversationId },
      { _id: 0, participants: 1 }
    ))!;

    return result.participants.map((id) => String(id));
  }

  async checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<string | null> {
    const result = await conversationModel.findOne(
      {
        isGroup: false,
        participants: { $all: [userId, receiverId], $size: 2 },
      },
      {
        _id: 1,
      }
    );

    return result ? String(result._id) : null;
  }

  async findGroupAdminIds(conversationId: string): Promise<string[]> {
    const result = await conversationModel.findOne(
      { _id: conversationId, isDeleted: false, isGroup: true },
      { _id: 0, Admins: 1 }
    );

    return result!.Admins.map((id) => String(id));
  }

  async findConversationById(
    conversationId: string
  ): Promise<GroupChatListType> {
    const result = (await conversationModel
      .findOne({ _id: conversationId, isDeleted: false, isGroup: true })
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
      avatar: result.avatar,
      isPaid: result.isPaid,
      isBlocked: result.isBlocked,
      blockedAt: result.blockedAt,
    };
  }

  async findAllGroupsWithSearch(
    query: any,
    page: number
  ): Promise<{ data: GroupChatType[]; totalPages: number }> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [groups, countResult] = await Promise.all([
      conversationModel
        .find(query, {
          _id: 1,
          participants: 1,
          Admins: 1,
          groupName: 1,
          about: 1,
          createdAt: 1,
          createdBy: 1,
          avatar: 1,
          isPaid: 1,
          isBlocked: 1,
          blockedAt: 1,
        })
        .populate('participants', '_id name avatar username')
        .populate({
          path: 'createdBy',
          select: '_id name username avatar',
          options: { strictPopulate: false },
        })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      conversationModel.countDocuments(query),
    ]);

    const groupData: GroupChatType[] = groups.map((group) => ({
      _id: String(group._id),
      participants: group.participants.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        avatar: p.avatar,
        username: p.username,
      })),
      Admins: group.Admins.map((id: any) => String(id)),
      groupName: group.groupName ?? null,
      about: group.about ?? null,
      createdAt: group.createdAt,
      createdBy:
        group.createdBy &&
        typeof group.createdBy === 'object' &&
        'name' in group.createdBy
          ? {
              _id: String((group.createdBy as any)._id),
              name: (group.createdBy as any).name,
              username: (group.createdBy as any).username,
              avatar: (group.createdBy as any).avatar,
            }
          : {
              _id: '',
              name: 'Unknown',
              username: 'unknown',
              avatar: '',
            },
      avatar: group.avatar ?? null,
      isPaid: group.isPaid ?? false,
      isBlocked: group.isBlocked ?? false,
      blockedAt: group.blockedAt ?? null,
    }));

    return {
      data: groupData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async findDeletedGroups(
    searchValue: string,
    page: number
  ): Promise<{ data: DeleteGroupsReturnType[]; totalPages: number }> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const filter = {
      isDeleted: true,
      groupName: { $regex: searchValue, $options: 'i' },
      isGroup: true,
    };

    const [groups, countResult] = await Promise.all([
      conversationModel
        .find(filter, {
          _id: 1,
          participants: 1,
          Admins: 1,
          groupName: 1,
          about: 1,
          createdAt: 1,
          createdBy: 1,
          avatar: 1,
          isPaid: 1,
          isBlocked: 1,
          blockedAt: 1,
          isDeleted: 1,
          deletedAt: 1,
          deletedBy: 1,
        })
        .populate('participants', '_id name avatar username')
        .populate({
          path: 'createdBy',
          select: '_id name username avatar',
          options: { strictPopulate: false },
        })
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      conversationModel.countDocuments(filter),
    ]);

    const groupData: DeleteGroupsReturnType[] = groups.map((group) => ({
      _id: String(group._id),
      participants: group.participants.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        avatar: p.avatar,
        username: p.username,
      })),
      Admins: group.Admins.map((id: any) => String(id)),
      groupName: group.groupName ?? null,
      about: group.about ?? null,
      createdAt: group.createdAt,
      createdBy:
        group.createdBy &&
        typeof group.createdBy === 'object' &&
        'name' in group.createdBy
          ? {
              _id: String((group.createdBy as any)._id),
              name: (group.createdBy as any).name,
              username: (group.createdBy as any).username,
              avatar: (group.createdBy as any).avatar,
            }
          : {
              _id: '',
              name: 'Unknown',
              username: 'unknown',
              avatar: '',
            },
      avatar: group.avatar ?? null,
      isPaid: group.isPaid ?? false,
      isBlocked: group.isBlocked ?? false,
      blockedAt: group.blockedAt ?? null,
      isDeleted: group.isDeleted ?? false,
      deletedAt: group.deletedAt ?? null,
    }));

    return {
      data: groupData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }
}
