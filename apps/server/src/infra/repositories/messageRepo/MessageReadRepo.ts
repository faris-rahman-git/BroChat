import messageModel from '../../databases/mongo/db/messageModel';
import { IMessageReadRepo } from '../../../app/repositories/message/IMessageReadRepo';
import { MessageType, Point, StatsReturn } from '@bro/shared';
import { PipelineStage } from 'mongoose';

export class MessageReadRepo implements IMessageReadRepo {
  async findByTempId(tempId: string): Promise<string | null> {
    const result = await messageModel.findOne({ tempId }, { _id: 1 }).lean();
    return result?._id.toString() ?? null;
  }

  async findMessages(
    conversationId: string,
    userId: string
  ): Promise<MessageType[]> {
    const result = await messageModel
      .find({
        conversationId,
        deletedBy: { $nin: [userId] },
      })
      .populate({
        path: 'senderId',
        select: 'name avatar',
        options: { strictPopulate: false },
      })
      .populate({
        path: 'reactions.userId',
        select: 'name avatar',
        options: { strictPopulate: false },
      })
      .populate({
        path: 'replyTo',
        select: '_id senderId MessageType content mediaUrl',
        populate: {
          path: 'senderId',
          select: 'name _id',
          options: { strictPopulate: false },
        },
        options: { strictPopulate: false },
      })
      .sort({ messageTime: 1 });

    return result.map((m: any) => {
      return {
        tempId: m.tempId,
        _id: String(m._id),
        conversationId: String(m.conversationId),
        senderId: String(m.senderId?._id),
        senderName: m.senderId?.name,
        senderAvatar: m.senderId?.avatar,
        MessageType: m.MessageType,
        content: m.content,
        mediaUrl: m.mediaUrl,
        isEdited: m.isEdited,
        status: m.status,
        messageTime: m.messageTime,
        createdAt: m.createdAt,
        isForward: m.isForward,
        reactions: m.reactions.map((r: any) => {
          return {
            userId: String(r.userId?._id),
            name: r.userId?.name,
            avatar: r.userId?.avatar,
            emoji: r.emoji,
          };
        }),
        replyTo: {
          _id: m.replyTo?._id ? String(m.replyTo?._id) : undefined,
          senderId : String(m.replyTo?.senderId?._id),
          senderName: m.replyTo?.senderId?.name,
          MessageType: m.replyTo?.MessageType,
          content: m.replyTo?.content,
          mediaUrl: m.replyTo?.mediaUrl,
        },
      };
    });
  }

  async findMessageCreatedAt(messageId: string): Promise<string | Date> {
    const result = await messageModel
      .findOne({ _id: messageId }, { createdAt: 1 })
      .lean();

    return result!.createdAt;
  }

  async getChatStatsData(): Promise<StatsReturn> {
    const now = new Date();

    // TODAY (UTC boundaries)
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const startOfTomorrow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );

    // CURRENT WEEK (UTC) — Monday to Sunday
    const utcDay = now.getUTCDay(); // 0 = Sun
    const isoDay = utcDay === 0 ? 7 : utcDay;
    const daysSinceMonday = isoDay - 1;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysSinceMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

    // CURRENT MONTH (UTC)
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
    );

    // CURRENT YEAR (UTC)
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const startOfNextYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));

    // Common match filter for non-group messages
    const chatFilter = {
      $or: [{ isGroup: false }, { isGroup: { $exists: false } }],
    };

    // 1) DAY: bucket every 4 hours
    const dayPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfToday, $lt: startOfTomorrow },
          ...chatFilter,
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

    // 2) WEEK: group by ISO weekday
    const weekPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lt: endOfWeek },
          ...chatFilter,
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

    // 3) MONTH: group by week-of-month
    const monthPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
          ...chatFilter,
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

    // 4) YEAR: group by quarter
    const yearPipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfYear, $lt: startOfNextYear },
          ...chatFilter,
        },
      },
      { $project: { month: { $month: '$createdAt' } } },
      {
        $group: {
          _id: { $ceil: { $divide: ['$month', 3] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // Run all pipelines
    const [dayAgg, weekAgg, monthAgg, yearAgg] = await Promise.all([
      messageModel.aggregate(dayPipeline).allowDiskUse(true).exec(),
      messageModel.aggregate(weekPipeline).allowDiskUse(true).exec(),
      messageModel.aggregate(monthPipeline).allowDiskUse(true).exec(),
      messageModel.aggregate(yearPipeline).allowDiskUse(true).exec(),
    ]);

    // Convert results to maps
    const dayMap = new Map<number, number>();
    (dayAgg || []).forEach((r: any) => {
      const d = r._id instanceof Date ? r._id : new Date(r._id);
      const hour = d.getUTCHours();
      dayMap.set(hour, r.count ?? 0);
    });

    const weekMap = new Map<number, number>();
    (weekAgg || []).forEach((r: any) =>
      weekMap.set(Number(r._id), r.count ?? 0)
    );

    const monthMap = new Map<number, number>();
    (monthAgg || []).forEach((r: any) =>
      monthMap.set(Number(r._id), r.count ?? 0)
    );

    const yearMap = new Map<number, number>();
    (yearAgg || []).forEach((r: any) =>
      yearMap.set(Number(r._id), r.count ?? 0)
    );

    // DAY buckets: 00:00, 04:00, ..., 20:00
    const dayBuckets: Point[] = [];
    for (let h = 0; h < 24; h += 4) {
      const labelDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h)
      );
      const label = labelDate.toISOString().slice(11, 16);
      const value = dayMap.get(h) ?? 0;
      dayBuckets.push({ name: label, value });
    }

    // WEEK buckets: Mon..Sun
    const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekBuckets: Point[] = weekdayNames.map((label, idx) => {
      const iso = idx + 1;
      return { name: label, value: weekMap.get(iso) ?? 0 };
    });

    // MONTH buckets: Week 1..Week N
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

    // YEAR buckets: Q1..Q4
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
