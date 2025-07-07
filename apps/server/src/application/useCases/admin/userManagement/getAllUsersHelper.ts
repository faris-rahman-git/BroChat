import { buildUserSearchQuery } from '../../../../utils/admin/buildUserSearchQuery';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { AllUsersType } from '@bro/shared';

export const getAllUsersHelper = async (
  repo: iUserRepo,
  searchValue: string,
  status: string,
  joinedAt: string
): Promise<AllUsersType[]> => {
  const searchQuery = buildUserSearchQuery(searchValue, status, joinedAt);
  const usersList = await repo.findAllUsersWithSearch(searchQuery);
  return usersList;
};
