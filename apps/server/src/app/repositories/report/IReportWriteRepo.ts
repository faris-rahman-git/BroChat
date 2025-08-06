export interface IReportWriteRepo {
  reportUser(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<void>;
  takeActionOnReport(
    reportId: string,
    note: string,
    takenAction: string,
    isDeleted: boolean
  ): Promise<void>;
}
