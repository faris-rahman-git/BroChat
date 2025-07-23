import { iReportRepo } from '../../../interfaces/iReportRepo';

export const reportUserHelper = async (
  repRepo: iReportRepo,
  userId: string,
  conversationId: string,
  reason: string,
  reportedUserId: string
): Promise<void> => {
  await repRepo.reportUser(userId, conversationId, reason, reportedUserId);
};
