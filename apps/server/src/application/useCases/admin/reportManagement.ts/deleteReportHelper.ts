import { iReportRepo } from '../../../interfaces/iReportRepo';

export const deleteReportHelper = async (
  repRepo: iReportRepo,
  reportId: string,
  note: string
): Promise<void> => {
  await repRepo.takeActionOnReport(reportId, note, 'Delete Report', true);
};
