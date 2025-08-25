import { FilterQuery, PipelineStage } from 'mongoose';

import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';
import userModel from '../../databases/mongo/db/userModel';
import {
  MainAllUsersListType,
  GroupMember,
  userDetailsType,
  StatsReturn,
  Point,
} from '@bro/shared';
import {
  FindEmailType,
  SearchRawType,
} from '../../../domain/dtos/user/UserRepoTypes';

export class UserReadRepo implements IUserReadRepo {
  async findEmail(email: string): Promise<FindEmailType | null> {
    const result = await userModel
      .findOne(
        { email },
        {
          _id: 1,
          name: 1,
          email: 1,
          password: 1,
          role: 1,
          isBlocked: 1,
          isDeleted: 1,
        }
      )
      .lean();

    if (!result) return null;

    return {
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password,
      role: result.role,
      isBlocked: result.isBlocked,
      isDeleted: result.isDeleted,
    };
  }

  async findUserDetailsById(userId: string): Promise<userDetailsType> {
    const result = await userModel
      .findOne(
        { _id: userId },
        {
          _id: 1,
          name: 1,
          username: 1,
          phoneNumber: 1,
          avatar: 1,
          about: 1,
          email: 1,
          blockedUsers: 1,
          role: 1,
          isSubscribed: 1,
          subscriptionPlan: 1,
          subscriptionStart: 1,
          subscriptionEnd: 1,
          isExclusive: 1,
        }
      )
      .populate({
        path: 'blockedUsers',
        select: '_id name avatar username',
        options: { strictPopulate: false },
      })
      .lean();

    if (!result) throw new Error('User not found');

    return {
      id: result._id.toString(),
      name: result.name,
      username: result.username,
      phoneNumber: result.phoneNumber,
      avatar: result.avatar,
      about: result.about,
      email: result.email,
      blockedUsers: (result.blockedUsers ?? []).map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        username: user.username,
      })),
      role: result.role,
      isSubscribed: result.isSubscribed,
      subscriptionPlan: result.subscriptionPlan,
      subscriptionStart: result.subscriptionStart,
      subscriptionEnd: result.subscriptionEnd,
      isExclusive: result.isExclusive,
    };
  }

  async findUsername(username: string): Promise<string | null> {
    const result = await userModel.findOne({ username }, { _id: 1 });
    return result ? result._id.toString() : null;
  }

  async findMatchUsers(
    searchData: string,
    userId: string
  ): Promise<SearchRawType[]> {
    const result = await userModel
      .find(
        {
          $and: [
            {
              $or: [
                { name: { $regex: searchData, $options: 'i' } },
                { username: { $regex: searchData, $options: 'i' } },
              ],
              _id: { $ne: userId }, // exclude self
            },
            { role: 'user' },
          ],
        },
        {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          email: 1,
          about: 1,
          phoneNumber: 1,
          createdAt: 1,
          blockedUsers: 1,
          blockedByUsers: 1,
          isSubscribed: 1,
          isExclusive: 1,
        }
      )
      .lean();

    return result.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      about: user.about,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      isSubscribed: user.isSubscribed,
      blockedUsers: (user.blockedUsers ?? []).map((id: any) => String(id)),
      blockedByUsers: (user.blockedByUsers ?? []).map((id: any) => String(id)),
      isExclusive: user.isExclusive,
    }));
  }

  async findDetailsById(userId: string): Promise<Omit<SearchRawType, '_id'>> {
    const result = (await userModel
      .findOne(
        { _id: userId },
        {
          _id: 0,
          name: 1,
          username: 1,
          avatar: 1,
          email: 1,
          phoneNumber: 1,
          createdAt: 1,
          about: 1,
          blockedUsers: 1,
          blockedByUsers: 1,
        }
      )
      .lean())!;

    return {
      name: result.name,
      username: result.username,
      avatar: result.avatar,
      email: result.email,
      phoneNumber: result.phoneNumber,
      createdAt: result.createdAt,
      about: result.about,
      blockedUsers: (result.blockedUsers ?? []).map((id) => id.toString()),
      blockedByUsers: (result.blockedByUsers ?? []).map((id) => id.toString()),
    };
  }

  async findAllUsersWithSearch(
    query: FilterQuery<any>,
    page: number
  ): Promise<MainAllUsersListType> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [user, countResult] = await Promise.all([
      userModel
        .find(query, {
          _id: 1,
          username: 1,
          email: 1,
          isBlocked: 1,
          blockedAt: 1,
          createdAt: 1,
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          isDeleted: 1,
          deletedAt: 1,
          deletedBy: 1,
          isSubscribed: 1,
          subscriptionPlan: 1,
          subscriptionStart: 1,
          subscriptionEnd: 1,
        })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      userModel.countDocuments(query),
    ]);

    const userData = user.map((userDoc) => ({
      _id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      isBlocked: userDoc.isBlocked,
      blockedAt: userDoc.blockedAt,
      createdAt: userDoc.createdAt,
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      avatar: userDoc.avatar,
      isDeleted: userDoc.isDeleted,
      deletedAt: userDoc.deletedAt,
      deletedBy: userDoc.deletedBy,
      isSubscribed: userDoc.isSubscribed,
      subscriptionPlan: userDoc.subscriptionPlan,
      subscriptionStart: userDoc.subscriptionStart,
      subscriptionEnd: userDoc.subscriptionEnd,
    }));

    return {
      data: userData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async findDeletedUsers(
    searchValue: string,
    page: number
  ): Promise<MainAllUsersListType> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const filter = {
      $or: [
        { email: { $regex: searchValue, $options: 'i' } },
        { username: { $regex: searchValue, $options: 'i' } },
      ],
      role: 'user',
      isDeleted: true,
    };

    const [user, countResult] = await Promise.all([
      userModel
        .find(filter, {
          _id: 1,
          username: 1,
          email: 1,
          isBlocked: 1,
          blockedAt: 1,
          createdAt: 1,
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          isDeleted: 1,
          deletedAt: 1,
          deletedBy: 1,
        })
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      userModel.countDocuments(filter),
    ]);

    const userData = user.map((userDoc) => ({
      _id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      isBlocked: userDoc.isBlocked,
      blockedAt: userDoc.blockedAt,
      createdAt: userDoc.createdAt,
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      avatar: userDoc.avatar,
      isDeleted: userDoc.isDeleted,
      deletedAt: userDoc.deletedAt,
      deletedBy: userDoc.deletedBy,
    }));

    return {
      data: userData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async getUsersMinimalDetails(userIds: string[]): Promise<GroupMember[]> {
    const users = await userModel
      .find(
        { _id: { $in: userIds } },
        { _id: 1, name: 1, avatar: 1, username: 1 }
      )
      .lean();

    return users.map((u) => ({
      _id: String(u._id),
      name: u.name,
      avatar: u.avatar,
      username: u.username,
    }));
  }

  async findIsSubscribed(userId: string): Promise<boolean> {
    const result = await userModel
      .findOne(
        { _id: userId },
        {
          isSubscribed: 1,
        }
      )
      .lean();

    return result!.isSubscribed;
  }

  async findExpiredSubscriptionsUserId(): Promise<string[]> {
    const result = await userModel
      .find(
        { isSubscribed: true, subscriptionEnd: { $lt: new Date() } },
        { _id: 1 }
      )
      .lean();

    return result.map((u) => String(u._id));
  }

  async findUserCounts(): Promise<{ totalUsers: number; activeUsers: number }> {
    const totalUsers = await userModel.countDocuments({ role: 'user' });
    const activeUsers = await userModel.countDocuments({
      role: 'user',
      isBlocked: false,
      isDeleted: false,
    });
    return { totalUsers, activeUsers };
  }

  async getUserStatsData(): Promise<StatsReturn> {
    const now = new Date();

    // TODAY (UTC)
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const startOfTomorrow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );

    // CURRENT WEEK (UTC) — Monday to Sunday
    const utcDay = now.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
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

    // 1) DAY: bucket every 4 hours
    const dayPipeline: PipelineStage[] = [
      { $match: { createdAt: { $gte: startOfToday, $lt: startOfTomorrow } } },
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
      { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
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
      { $match: { createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } } },
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
      { $match: { createdAt: { $gte: startOfYear, $lt: startOfNextYear } } },
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
      userModel.aggregate(dayPipeline).allowDiskUse(true).exec(),
      userModel.aggregate(weekPipeline).allowDiskUse(true).exec(),
      userModel.aggregate(monthPipeline).allowDiskUse(true).exec(),
      userModel.aggregate(yearPipeline).allowDiskUse(true).exec(),
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
