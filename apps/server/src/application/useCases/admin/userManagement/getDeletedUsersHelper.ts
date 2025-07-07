import { iUserRepo } from '../../../interfaces/iUserRepo';
import { DeletedUserListType } from '@bro/shared';

export const getDeletedUsersHelper = async (
  repo: iUserRepo,
  searchValue: string
): Promise<DeletedUserListType[]> => {
  const usersList = await repo.findDeletedUsers(searchValue);
  return usersList;
};
