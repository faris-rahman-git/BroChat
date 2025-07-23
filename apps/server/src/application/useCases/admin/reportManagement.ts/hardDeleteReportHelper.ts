import { iReportRepo } from '../../../interfaces/iReportRepo';

export const hardDeleteReportHelper = async (
  repRepo: iReportRepo,
  reportId: string
): Promise<void> => {
  await repRepo.deleteReport(reportId);
};
