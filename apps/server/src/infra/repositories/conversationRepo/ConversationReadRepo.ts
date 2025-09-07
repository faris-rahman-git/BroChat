import conversationModel from '../../databases/mongo/db/conversationModel';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';

import { usersList } from '../../../domain/entity/user/ConversationRepoTypes';
import {
  DeleteGroupsReturnType,
  findConversationNameType,
  GroupChatListType,
  GroupChatType,
  Point,
  StatsReturn,
} from '@bro/shared';
import { PipelineStage } from 'mongoose';
import {
  populatedGroupParticipantType,
  populatedParticipantType,
} from '../../types/conversationDocment';
import { populatedSenderIdType } from '../../types/messageDocumet';

export class ConversationReadRepo implements IConversationReadRepo {
  async findDMs(userId: string): Promise<usersList[]> {
    const result = await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 1, participants: 1, createdAt: 1 }
      )
      .populate(
        'participants',
        '_id name avatar username email phoneNumber about blockedUsers blockedByUsers createdAt isSubscribed isExclusive'
      )
      .lean();

    return result.map((c) => ({
      _id: String(c._id),
      createdAt: c.createdAt,
      participants: c.participants.map((p) => {
        const participant = p as unknown as populatedParticipantType;
        return {
          _id: String(p._id),
          name: participant.name,
          avatar: participant.avatar,
          username: participant.username,
          email: participant.email,
          phoneNumber: participant.phoneNumber,
          about: participant.about,
          createdAt: participant.createdAt,
          isSubscribed: participant.isSubscribed,
          blockedUsers: (participant.blockedUsers ?? []).map((id) =>
            String(id)
          ),
          blockedByUsers: (participant.blockedByUsers ?? []).map((id) =>
            String(id)
          ),
          isExclusive: participant.isExclusive,
        };
      }),
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
      participants: group.participants.map((p) => {
        const participant = p as unknown as populatedGroupParticipantType;
        return {
          _id: String(participant._id),
          name: participant.name,
          avatar: participant.avatar,
          username: participant.username,
        };
      }),
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
      participants: result.participants.map((p) => {
        const participant = p as unknown as populatedGroupParticipantType;
        return {
          _id: String(participant._id),
          name: participant.name,
          avatar: participant.avatar,
          username: participant.username,
        };
      }),
      Admins: result.Admins.map((id) => String(id)),
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

    const groupData = groups.map((group) => {
      const created =
        group.createdBy as unknown as populatedGroupParticipantType;
      return {
        _id: String(group._id),
        participants: group.participants.map((p) => {
          const participant = p as unknown as populatedGroupParticipantType;
          return {
            _id: String(participant._id),
            name: participant.name,
            avatar: participant.avatar,
            username: participant.username,
          };
        }),
        Admins: group.Admins.map((id) => String(id)),
        groupName: group.groupName ?? null,
        about: group.about ?? null,
        createdAt: group.createdAt,
        createdBy: {
          _id: String(created?._id) ?? '',
          name: created?.name ?? 'Unknown',
          username: created?.username ?? 'Unknown',
          avatar: created?.avatar ?? '',
        },
        avatar: group.avatar ?? null,
        isPaid: group.isPaid ?? false,
        isBlocked: group.isBlocked ?? false,
        blockedAt: group.blockedAt ?? null,
      };
    });

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

    const groupData = groups.map((group) => {
      const created =
        group.createdBy as unknown as populatedGroupParticipantType;
      return {
        _id: String(group._id),
        participants: group.participants.map((p) => {
          const participant = p as unknown as populatedGroupParticipantType;
          return {
            _id: String(participant._id),
            name: participant.name,
            avatar: participant.avatar,
            username: participant.username,
          };
        }),
        Admins: group.Admins.map((id) => String(id)),
        groupName: group.groupName ?? null,
        about: group.about ?? null,
        createdAt: group.createdAt,
        createdBy: {
          _id: String(created?._id) ?? '',
          name: created?.name ?? 'Unknown',
          username: created?.username ?? 'Unknown',
          avatar: created?.avatar ?? '',
        },
        avatar: group.avatar ?? null,
        isPaid: group.isPaid ?? false,
        isBlocked: group.isBlocked ?? false,
        blockedAt: group.blockedAt ?? null,
        isDeleted: group.isDeleted ?? false,
        deletedAt: group.deletedAt ?? null,
      };
    });

    return {
      data: groupData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async findConversationName(
    conversationId: string,
    userId: string
  ): Promise<findConversationNameType> {
    const conversation = await conversationModel
      .findOne({ _id: conversationId })
      .select('isGroup groupName avatar participants')
      .populate('participants', '_id name avatar');

    if (!conversation) return { name: '', avatar: '' };

    if (conversation.isGroup) {
      return {
        name: conversation.groupName ?? '',
        avatar: conversation.avatar ?? '',
      };
    }

    const participants =
      conversation.participants as unknown as populatedSenderIdType[];

    const otherParticipant = participants.find(
      (p) => p._id.toString() !== userId
    );

    return {
      name: otherParticipant?.name ?? '',
      avatar: otherParticipant?.avatar ?? '',
    };
  }

  async findPersonalChatCounts(): Promise<{
    totalChat: number;
    newChat: number;
  }> {
    const totalChat = await conversationModel.countDocuments({
      isGroup: false,
    });
    const newChat = await conversationModel.countDocuments({
      isGroup: false,
      createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    });
    return { totalChat, newChat };
  }

  async findGroupChatCounts(): Promise<{ totalChat: number; newChat: number }> {
    const totalChat = await conversationModel.countDocuments({
      isGroup: true,
    });
    const newChat = await conversationModel.countDocuments({
      isGroup: true,
      createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    });
    return { totalChat, newChat };
  }

  async getGroupStatsData(): Promise<StatsReturn> {
    const now = new Date();

    // TODAY (UTC)
    const startOfToday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0
      )
    );
    const startOfTomorrow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      )
    );

    // CURRENT WEEK (UTC) — Monday..Sunday (ISO)
    const utcDay = now.getUTCDay();
    const isoDay = utcDay === 0 ? 7 : utcDay;
    const daysSinceMonday = isoDay - 1;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysSinceMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

    // CURRENT MONTH (UTC)
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
    );
    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0)
    );

    // CURRENT YEAR (UTC)
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0));
    const startOfNextYear = new Date(
      Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0)
    );

    // 1) DAY: bucket every 4 hours for today using $dateTrunc (hour, binSize:4)
    const dayPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfToday, $lt: startOfTomorrow },
          isGroup: true,
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$createdAt',
              unit: 'hour',
              binSize: 4,
              timezone: 'UTC',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 2) WEEK: group by ISO weekday (1 = Mon .. 7 = Sun)
    const weekPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lt: endOfWeek },
          isGroup: true,
        },
      },
      {
        $group: {
          _id: { $isoDayOfWeek: { date: '$createdAt', timezone: 'UTC' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 3) MONTH: group by week-of-month (floor((dayOfMonth-1)/7)+1)
    const monthPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
          isGroup: true,
        },
      },
      { $project: { dayOfMonth: { $dayOfMonth: '$createdAt' } } },
      {
        $group: {
          _id: {
            $add: [
              { $floor: { $divide: [{ $subtract: ['$dayOfMonth', 1] }, 7] } },
              1,
            ],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 4) YEAR: group by quarter (ceil(month/3))
    const yearPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfYear, $lt: startOfNextYear },
          isGroup: true,
        },
      },
      { $project: { month: { $month: '$createdAt' } } },
      {
        $group: {
          _id: { $ceil: { $divide: ['$month', 3] } }, // 1..4
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // Run pipelines in parallel
    const [dayAgg, weekAgg, monthAgg, yearAgg] = await Promise.all([
      conversationModel.aggregate(dayPipeline).allowDiskUse(true).exec(),
      conversationModel.aggregate(weekPipeline).allowDiskUse(true).exec(),
      conversationModel.aggregate(monthPipeline).allowDiskUse(true).exec(),
      conversationModel.aggregate(yearPipeline).allowDiskUse(true).exec(),
    ]);

    // Convert aggregations to maps for quick lookup
    const dayMap = new Map<number, number>();
    (dayAgg || []).forEach((r) => {
      const d = r._id instanceof Date ? r._id : new Date(r._id);
      const hour = d.getUTCHours();
      dayMap.set(hour, r.count ?? 0);
    });

    const weekMap = new Map<number, number>();
    (weekAgg || []).forEach((r) => weekMap.set(Number(r._id), r.count ?? 0));

    const monthMap = new Map<number, number>();
    (monthAgg || []).forEach((r) => monthMap.set(Number(r._id), r.count ?? 0));

    const yearMap = new Map<number, number>();
    (yearAgg || []).forEach((r) => yearMap.set(Number(r._id), r.count ?? 0));

    // DAY: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 (UTC)
    const dayBuckets: Point[] = [];
    for (let h = 0; h < 24; h += 4) {
      const labelDate = new Date(
        Date.UTC(
          startOfToday.getUTCFullYear(),
          startOfToday.getUTCMonth(),
          startOfToday.getUTCDate(),
          h,
          0,
          0
        )
      );
      const label = labelDate.toISOString().slice(11, 16); // 'HH:MM'
      const value = dayMap.get(h) ?? 0;
      dayBuckets.push({ name: label, value });
    }

    // WEEK: Mon..Sun
    const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekBuckets: Point[] = weekdayNames.map((label, idx) => {
      const iso = idx + 1;
      return { name: label, value: weekMap.get(iso) ?? 0 };
    });

    // MONTH: week 1..weeksInMonth
    const yearNum = startOfMonth.getUTCFullYear();
    const monthNum = startOfMonth.getUTCMonth();
    const daysInMonth = new Date(
      Date.UTC(yearNum, monthNum + 1, 0)
    ).getUTCDate();
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const monthBuckets: Point[] = Array.from({ length: weeksInMonth }).map(
      (_, i) => {
        const weekNo = i + 1;
        return { name: `Week ${weekNo}`, value: monthMap.get(weekNo) ?? 0 };
      }
    );

    // YEAR: Q1..Q4
    const yearLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
    const yearBuckets: Point[] = yearLabels.map((label, idx) => {
      const q = idx + 1;
      return { name: label, value: yearMap.get(q) ?? 0 };
    });

    return {
      day: dayBuckets,
      week: weekBuckets,
      month: monthBuckets,
      year: yearBuckets,
    };
  }
}
