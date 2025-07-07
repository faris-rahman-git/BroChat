import { buildUserSearchQuery } from '../../../../utils/admin/buildUserSearchQuery';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { AllUsersType } from '@bro/shared';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const softDeleteUserHelper = async (
  repo: iUserRepo,
  userId: string,
  searchValue: string,
  status: string,
  joinedAt: string
): Promise<AllUsersType[]> => {
  await repo.updateSoftDeleteStatus(userId, true, 'admin');

  await emitWithQueueServer({
    userId,
    event: 'force-logout',
    data: 'Your account was Deleted by admin',
    isDirect: true,
  });

  const searchQuery = buildUserSearchQuery(searchValue, status, joinedAt);
  const updatedUsersList = await repo.findAllUsersWithSearch(searchQuery);
  return updatedUsersList;
};
