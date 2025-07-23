import { ReportResponse } from '@bro/shared';

export interface iReportRepo {
  reportUser(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<void>;
  findReports(): Promise<ReportResponse[]>;
  findResolvedReports(): Promise<ReportResponse[]>;
  findDeletedReports(): Promise<ReportResponse[]>;
  takeActionOnReport(
    reportId: string,
    note: string,
    takenAction: string,
    isDeleted: boolean
  ): Promise<void>;
  deleteReport(reportId: string): Promise<void>;
}
