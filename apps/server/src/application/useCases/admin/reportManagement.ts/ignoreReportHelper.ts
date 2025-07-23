import { iReportRepo } from '../../../interfaces/iReportRepo';

export const ignoreReportHelper = async (
  repRepo: iReportRepo,
  reportId: string,
  note: string
): Promise<void> => {
  await repRepo.takeActionOnReport(reportId, note, 'No Action Taken' , false);
};
