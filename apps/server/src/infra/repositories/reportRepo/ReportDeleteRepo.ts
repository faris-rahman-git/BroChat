import reportModel from '../../databases/mongo/db/reportModel';
import { IReportDeleteRepo } from '../../../app/repositories/report/IReportDeleteRepo';

export class ReportDeleteRepo implements IReportDeleteRepo {
  async deleteReport(reportId: string): Promise<void> {
    await reportModel.deleteOne({ _id: reportId });
  }

  async deleteReportRelatedToAUser(userId: string): Promise<void> {
    await reportModel.deleteMany({
      $or: [{ reporterId: userId }, { reportedUserId: userId }],
    });
  }
}
