import { iReportRepo } from '../../../interfaces/iReportRepo';
import { ReportResponse } from '@bro/shared';

export const getAllReportHelper = async (
  repRepo: iReportRepo
): Promise<ReportResponse[]> => {
  const reportList = await repRepo.findReports();
  return reportList;
};
