import { iReportRepo } from '../../../interfaces/iReportRepo';
import { ReportResponse } from '@bro/shared';

export const getDeletedRepotsHelper = async (
  repRepo: iReportRepo
): Promise<ReportResponse[]> => {
  const reportList = await repRepo.findDeletedReports();
  return reportList;
};
