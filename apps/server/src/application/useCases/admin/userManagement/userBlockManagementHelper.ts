import { buildUserSearchQuery } from '../../../../utils/admin/buildUserSearchQuery';
import { iUserRepo } from '../../../interfaces/iUserRepo';
import { AllUsersType } from '@bro/shared';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';

export const userBlockManagementHelper = async (
  repo: iUserRepo,
  userId: string,
  isBlocked: boolean,
  searchValue: string,
  status: string,
  joinedAt: string
): Promise<AllUsersType[]> => {
  await repo.updateBlockStatus(userId, isBlocked);

  if (isBlocked) {
    await emitWithQueueServer({
      userId,
      event: 'force-logout',
      data: 'Your account was banned by admin',
      isDirect: true,
    });
  }

  const searchQuery = buildUserSearchQuery(searchValue, status, joinedAt);
  const updatedUsersList = await repo.findAllUsersWithSearch(searchQuery);
  return updatedUsersList;
};
