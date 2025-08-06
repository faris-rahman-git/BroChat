export interface IReportDeleteRepo {
  deleteReport(reportId: string): Promise<void>;
  deleteReportRelatedToAUser(userId: string): Promise<void>;
}
