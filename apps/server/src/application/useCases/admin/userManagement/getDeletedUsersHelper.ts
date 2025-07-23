import { iUserRepo } from '../../../interfaces/iUserRepo';
import { AllUsersType } from '@bro/shared';

export const getDeletedUsersHelper = async (
  repo: iUserRepo,
  searchValue: string
): Promise<AllUsersType[]> => {
  const usersList = await repo.findDeletedUsers(searchValue);
  return usersList;
};
