import { FilterQuery } from 'mongoose';

export const buildUserSearchQuery = (
  searchData: string,
  status: string,
  joinedAt: string
): FilterQuery<any> => {
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
};
