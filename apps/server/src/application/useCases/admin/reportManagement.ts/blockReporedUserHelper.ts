import { iUserRepo } from '../../../interfaces/iUserRepo';
import { emitWithQueueServer } from '../../../../infrastructure/socket/handlers/offlineQueue/emitWithQueueServer';
import { iReportRepo } from '../../../interfaces/iReportRepo';

export const blockReporedUserHelper = async (
  repo: iUserRepo,
  repRepo: iReportRepo,
  reportId: string,
  reportedUserId: string,
  note: string
): Promise<void> => {
  await repo.updateBlockStatus(reportedUserId, true);
  await repRepo.takeActionOnReport(reportId, note, 'User Blocked' , false);

  await emitWithQueueServer({
    userId: reportedUserId,
    event: 'force-logout',
    data: 'Your account was banned by admin',
    isDirect: true,
  });
};
