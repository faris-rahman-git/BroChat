import { iReportRepo } from '../../../interfaces/iReportRepo';
import { ReportResponse } from '@bro/shared';

export const getResolvedReportsHelper = async (
  repRepo: iReportRepo
): Promise<ReportResponse[]> => {
  const reportList = await repRepo.findResolvedReports();
  return reportList;
};
