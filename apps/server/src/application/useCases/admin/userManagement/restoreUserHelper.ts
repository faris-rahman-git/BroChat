import { iUserRepo } from '../../../interfaces/iUserRepo';

export const restoreUserHelper = async (
  repo: iUserRepo,
  userId: string,
  searchValue: string
) => {
  await repo.updateSoftDeleteStatus(userId, false, '');
  const updatedUsersList = await repo.findDeletedUsers(searchValue);
  return updatedUsersList;
};
