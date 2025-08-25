import { IPaymentReadRepo } from '../../../app/repositories/payment/IPaymentReadRepo';
import paymentModel from '../../databases/mongo/db/paymentModel';
import {
  AllTransactionsOutType,
  ExclusiveUserPaymentsType,
  findAllExclusiveUserCustomersTransactionsType,
  GetExclusiveUserPaymentsApiType,
  Point,
  StatsReturn,
} from '@bro/shared';
import { PipelineStage } from 'mongoose';

export class PaymentReadRepo implements IPaymentReadRepo {
  async getAllTransactions(
    query: any,
    page: number
  ): Promise<{
    data: AllTransactionsOutType[];
    totalPages: number;
  }> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [transactions, count] = await Promise.all([
      paymentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      paymentModel.countDocuments(query),
    ]);

    const data: AllTransactionsOutType[] = transactions.map((transaction) => ({
      feature: transaction.feature,
      userId: transaction.userId?.toString(),
      conversationId: transaction.conversationId?.toString(),
      orderId: transaction.orderId,
      paymentId: transaction.paymentId,
      signature: transaction.signature,
      amount: transaction.amount,
      recipientEmail: transaction.recipientEmail,
      recipientName: transaction.recipientName,
      createdAt: transaction.createdAt,
    }));

    return {
      data,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  async findAllExclusiveUserCustomersTransactions(userId: string): Promise<{
    list: findAllExclusiveUserCustomersTransactionsType[];
    totalCount: number;
    totalAmount: number;
  }> {
    const transactions = await paymentModel
      .find({
        feature: 'exclusive_user_customer',
        'exclusiveDetails.exclusiveUserId': userId,
      })
      .populate('userId', '_id name avatar username')
      .sort({ createdAt: -1 })
      .lean();
    const data: findAllExclusiveUserCustomersTransactionsType[] =
      transactions.map((transaction: any) => ({
        userDetails: {
          _id: String(transaction.userId?._id),
          name: transaction.userId?.name,
          avatar: transaction.userId?.avatar,
          username: transaction.userId?.username,
        },
        createdAt: transaction.createdAt,
        amount: transaction.exclusiveDetails?.userShare,
      }));
    const totalCount = data.length;

    const totalAmount = data.reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      list: data,
      totalCount,
      totalAmount,
    };
  }

  async findExclusiveUserPayments(
    data: GetExclusiveUserPaymentsApiType
  ): Promise<{ data: ExclusiveUserPaymentsType[]; totalPages: number }> {
    const pageSize = 10;
    const skip = (data.page - 1) * pageSize;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: { feature: 'exclusive_user_customer' },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'exclusiveDetails.exclusiveUserId',
          foreignField: '_id',
          as: 'exclusiveUser',
        },
      },
      { $unwind: '$exclusiveUser' },
      ...(data.searchValue?.trim()
        ? ([
            {
              $match: {
                $or: [
                  {
                    'exclusiveUser.name': {
                      $regex: data.searchValue,
                      $options: 'i',
                    },
                  },
                  {
                    'exclusiveUser.username': {
                      $regex: data.searchValue,
                      $options: 'i',
                    },
                  },
                ],
              },
            },
          ] as PipelineStage[])
        : []),
      {
        $group: {
          _id: '$exclusiveDetails.exclusiveUserId',
          exclusiveUser: { $first: '$exclusiveUser' },
          totalCustomers: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          userShare: { $sum: '$exclusiveDetails.userShare' },
          adminShare: { $sum: '$exclusiveDetails.adminShare' },
          customers: {
            $push: {
              feature: '$feature',
              userId: '$userId',
              conversationId: '$conversationId',
              orderId: '$orderId',
              paymentId: '$paymentId',
              signature: '$signature',
              amount: '$amount',
              recipientEmail: '$recipientEmail',
              recipientName: '$recipientName',
              createdAt: '$createdAt',
              adminShare: '$exclusiveDetails.adminShare',
              userShare: '$exclusiveDetails.userShare',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          exclusiveUser: {
            _id: '$exclusiveUser._id',
            name: '$exclusiveUser.name',
            avatar: '$exclusiveUser.avatar',
            username: '$exclusiveUser.username',
          },
          totalCustomers: 1,
          totalAmount: 1,
          userShare: 1,
          adminShare: 1,
          customers: 1,
        },
      },
      { $sort: { totalAmount: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const [payments, totalCount] = await Promise.all([
      paymentModel.aggregate(aggregationPipeline),
      paymentModel
        .aggregate([
          { $match: { feature: 'exclusive_user_customer' } },
          {
            $lookup: {
              from: 'usermodels',
              localField: 'exclusiveDetails.exclusiveUserId',
              foreignField: '_id',
              as: 'exclusiveUser',
            },
          },
          { $unwind: '$exclusiveUser' },
          ...(data.searchValue?.trim()
            ? ([
                {
                  $match: {
                    $or: [
                      {
                        'exclusiveUser.name': {
                          $regex: data.searchValue,
                          $options: 'i',
                        },
                      },
                      {
                        'exclusiveUser.username': {
                          $regex: data.searchValue,
                          $options: 'i',
                        },
                      },
                    ],
                  },
                },
              ] as PipelineStage[])
            : []),
          { $group: { _id: '$exclusiveDetails.exclusiveUserId' } },
          { $count: 'total' },
        ])
        .then((res) => (res.length ? res[0].total : 0)),
    ]);

    return {
      data: payments as ExclusiveUserPaymentsType[],
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async findTotalRevenue(): Promise<{
    totalRevenue: number;
    todayRevenue: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    const pipeline: PipelineStage[] = [
      {
        $facet: {
          totalRevenue: [
            {
              // group everything and sum conditionally:
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $cond: [
                      { $eq: ['$feature', 'exclusive_user_customer'] },
                      // prefer exclusiveDetails.adminShare; if missing, fall back to amount
                      { $ifNull: ['$exclusiveDetails.adminShare', '$amount'] },
                      '$amount',
                    ],
                  },
                },
              },
            },
          ],
          todayRevenue: [
            {
              $match: {
                createdAt: { $gte: startOfToday, $lt: startOfTomorrow },
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $cond: [
                      { $eq: ['$feature', 'exclusive_user_customer'] },
                      { $ifNull: ['$exclusiveDetails.adminShare', '$amount'] },
                      '$amount',
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      // optional: project to flatten arrays
      {
        $project: {
          totalRevenue: {
            $ifNull: [{ $arrayElemAt: ['$totalRevenue.total', 0] }, 0],
          },
          todayRevenue: {
            $ifNull: [{ $arrayElemAt: ['$todayRevenue.total', 0] }, 0],
          },
        },
      },
    ];

    const res = await paymentModel.aggregate(pipeline).exec();

    const { totalRevenue = 0, todayRevenue = 0 } = res[0] ?? {};

    return {
      totalRevenue: Math.round(totalRevenue),
      todayRevenue: Math.round(todayRevenue),
    };
  }

  async getRevenueStats(): Promise<StatsReturn> {
    const now = new Date();

    // UTC boundaries
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

    // Current week Monday..next Monday (ISO Mon=1..Sun=7)
    const utcDay = now.getUTCDay(); // 0 (Sun) .. 6 (Sat)
    const isoDay = utcDay === 0 ? 7 : utcDay; // 1..7
    const daysSinceMonday = isoDay - 1;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysSinceMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

    // Current month
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
    );
    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0)
    );

    // Current year
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0));
    const startOfNextYear = new Date(
      Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0)
    );

    // conditional expression to pick adminShare for exclusive_user_customer otherwise amount
    const revenueExpr = {
      $cond: [
        { $eq: ['$feature', 'exclusive_user_customer'] },
        { $ifNull: ['$exclusiveDetails.adminShare', '$amount'] },
        '$amount',
      ],
    };

    // 1) DAY pipeline: $dateTrunc hour binSize:4
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
          total: { $sum: revenueExpr },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 2) WEEK pipeline: group by isoDayOfWeek (1..7)
    const weekPipeline: PipelineStage[] = [
      { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
      {
        $group: {
          _id: { $isoDayOfWeek: { date: '$createdAt', timezone: 'UTC' } },
          total: { $sum: revenueExpr },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 3) MONTH pipeline: group by week-of-month: floor((dayOfMonth-1)/7)+1
    const monthPipeline: PipelineStage[] = [
      { $match: { createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } } },
      {
        $project: {
          dayOfMonth: { $dayOfMonth: '$createdAt' },
          revenue: revenueExpr,
        },
      },
      {
        $group: {
          _id: {
            $add: [
              { $floor: { $divide: [{ $subtract: ['$dayOfMonth', 1] }, 7] } },
              1,
            ],
          },
          total: { $sum: '$revenue' },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // 4) YEAR pipeline: group by quarter ceil(month/3)
    const yearPipeline: PipelineStage[] = [
      { $match: { createdAt: { $gte: startOfYear, $lt: startOfNextYear } } },
      { $project: { month: { $month: '$createdAt' }, revenue: revenueExpr } },
      {
        $group: {
          _id: { $ceil: { $divide: ['$month', 3] } }, // 1..4
          total: { $sum: '$revenue' },
        },
      },
      { $sort: { _id: 1 } },
    ];

    // Run aggregations in parallel
    const [dayAgg, weekAgg, monthAgg, yearAgg] = await Promise.all([
      paymentModel.aggregate(dayPipeline).allowDiskUse(true).exec(),
      paymentModel.aggregate(weekPipeline).allowDiskUse(true).exec(),
      paymentModel.aggregate(monthPipeline).allowDiskUse(true).exec(),
      paymentModel.aggregate(yearPipeline).allowDiskUse(true).exec(),
    ]);

    // Convert results to maps
    const dayMap = new Map<number, number>(); // keyed by truncated hour (0,4,8,...)
    (dayAgg || []).forEach((r: any) => {
      const d = r._id instanceof Date ? r._id : new Date(r._id);
      const hour = d.getUTCHours();
      dayMap.set(hour, Math.round(r.total ?? 0));
    });

    const weekMap = new Map<number, number>(); // 1..7
    (weekAgg || []).forEach((r: any) =>
      weekMap.set(Number(r._id), Math.round(r.total ?? 0))
    );

    const monthMap = new Map<number, number>(); // week indexes 1..N
    (monthAgg || []).forEach((r: any) =>
      monthMap.set(Number(r._id), Math.round(r.total ?? 0))
    );

    const yearMap = new Map<number, number>(); // 1..4
    (yearAgg || []).forEach((r: any) =>
      yearMap.set(Number(r._id), Math.round(r.total ?? 0))
    );

    // Build final arrays with zero-fill

    // Day buckets: 00:00,04:00,... (UTC)
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

    // Week buckets: Mon..Sun
    const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekBuckets: Point[] = weekdayNames.map((label, idx) => {
      const iso = idx + 1;
      return { name: label, value: weekMap.get(iso) ?? 0 };
    });

    // Month buckets: Weeks in current month
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

    // Year buckets: Q1..Q4
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
