import reportModel from '../../databases/mongo/db/reportModel';
import { IReportWriteRepo } from '../../../app/repositories/report/IReportWriteRepo';

export class ReportWriteRepo implements IReportWriteRepo {
  async reportUser(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<void> {
    await reportModel.create({
      reporterId: userId,
      conversationId: conversationId,
      reason: reason,
      reportedUserId: reportedUserId,
    });
  }

  async takeActionOnReport(
    reportId: string,
    note: string,
    takenAction: string,
    isDeleted: boolean
  ): Promise<void> {
    await reportModel.updateOne(
      { _id: reportId },
      {
        $set: {
          takenAction,
          note: note,
          status: 'resolved',
          isDeleted: isDeleted,
          actionTakeAt: new Date(),
        },
      }
    );
  }
}
