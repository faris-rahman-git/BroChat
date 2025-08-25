import { IQueryService } from '../../../app/providers/admin/IQueryService';
import { GetAllGroupParams, getAllPaymetsType } from '@bro/shared';

export class QueryService implements IQueryService {
  searchQuery(searchData: string, status: string, joinedAt: string): any {
    const query: any = {
      $and: [{ role: 'user', isDeleted: false }],
    };

    // Search filter
    if (searchData.trim() !== '') {
      query.$and.push({
        $or: [
          { email: { $regex: searchData, $options: 'i' } },
          { username: { $regex: searchData, $options: 'i' } },
        ],
      });
    }

    // Status filter
    if (status === 'active') {
      query.$and.push({ isBlocked: false });
    } else if (status === 'blocked') {
      query.$and.push({ isBlocked: true });
    }

    // Date filter
    if (joinedAt.trim() !== '') {
      const date = new Date(joinedAt);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      query.$and.push({
        createdAt: {
          $gte: date,
          $lt: nextDate,
        },
      });
    }

    return query;
  }

  searchQueryForReports(searchData: string, createdAt?: string): any {
    const query: any = { $and: [] };

    query.$and.push({ status: 'pending' });

    if (searchData.trim() !== '') {
      query.$and.push({
        $or: [
          { reason: { $regex: searchData, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$_id' },
                regex: searchData,
                options: 'i',
              },
            },
          },
        ],
      });
    }

    // Filter by creation date
    if (createdAt) {
      const date = new Date(createdAt);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      query.$and.push({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      });
    }

    return query;
  }

  searchQueryForRevenue({
    searchValue = '',
    type,
    createdAt,
  }: Omit<getAllPaymetsType, 'page'>): any {
    const query: any = { $and: [] };
    query.$and.push({ feature: { $ne: 'exclusive_user_customer' } });

    // Search by recipient name, email, or order/payment ID
    if (searchValue.trim() !== '') {
      query.$and.push({
        $or: [
          { recipientName: { $regex: searchValue, $options: 'i' } },
          { recipientEmail: { $regex: searchValue, $options: 'i' } },
          { orderId: { $regex: searchValue, $options: 'i' } },
          { paymentId: { $regex: searchValue, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$_id' },
                regex: searchValue,
                options: 'i',
              },
            },
          },
        ],
      });
    }

    // Filter by feature (monthly, yearly, premium_group)
    if (type) {
      query.$and.push({ feature: type });
    }

    // Filter by payment created date
    if (createdAt) {
      const date = new Date(createdAt);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      query.$and.push({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      });
    }

    // If no filters are applied, return an empty object instead of $and: []
    return query.$and.length ? query : {};
  }

  searchQueryForGroups({
    searchValue = '',
    status,
    createdAt,
  }: Omit<GetAllGroupParams, 'page'>) {
    const query: any = { $and: [{ isDeleted: false, isGroup: true }] };

    if (searchValue.trim() !== '') {
      query.$and.push({
        $or: [{ groupName: { $regex: searchValue, $options: 'i' } }],
      });
    }

    if (status === 'active') {
      query.$and.push({ isBlocked: false });
    } else if (status === 'blocked') {
      query.$and.push({ isBlocked: true });
    }

    if (createdAt) {
      const date = new Date(createdAt);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      query.$and.push({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      });
    }

    return query.$and.length ? query : {};
  }
}
