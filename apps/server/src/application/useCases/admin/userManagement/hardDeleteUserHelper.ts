import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { iUserRepo } from '../../../interfaces/iUserRepo';

export const hardDeleteUserHelper = async (
  repo: iUserRepo,
  userId: string,
  searchValue: string
) => {
  await repo.deleteUser(userId);

  await emitWithQueueServer({
    userId,
    event: 'force-logout',
    data: 'Your account was Deleted by admin',
    isDirect : true
  });

  const updatedUsersList = await repo.findDeletedUsers(searchValue);
  return updatedUsersList;
};
