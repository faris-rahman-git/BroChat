import { iReportRepo } from '../../application/interfaces/iReportRepo';
import reportModel from '../database/reportModel';
import { ReportResponse } from '@bro/shared';

export class reportRepo implements iReportRepo {
  async reportUser(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<void> {
    await reportModel.create({
      reporterId: userId,
      conversationId,
      reason,
      reportedUserId,
    });
  }

  async findReports(): Promise<ReportResponse[]> {
    const reports = await reportModel
      .find({ status: 'pending' })
      .populate('reporterId', 'username _id')
      .populate('reportedUserId', 'username _id isBlocked isDeleted')
      .select('reporterId reportedUserId conversationId reason createdAt')
      .lean();

    const formattedReports: ReportResponse[] = reports.map((report: any) => ({
      _id: report._id.toString(),
      reporterId: {
        _id: report.reporterId._id.toString(),
        username: report.reporterId.username,
      },
      reportedUserId: {
        _id: report.reportedUserId._id.toString(),
        username: report.reportedUserId.username,
        isBlocked: report.reportedUserId.isBlocked,
        isDeleted: report.reportedUserId.isDeleted,
      },
      conversationId: report.conversationId?.toString() || '',
      reason: report.reason,
      createdAt: report.createdAt,
    }));

    return formattedReports;
  }

  async findResolvedReports(): Promise<ReportResponse[]> {
    const reports = await reportModel
      .find({ status: 'resolved', isDeleted: false })
      .populate('reporterId', 'username _id')
      .populate('reportedUserId', 'username _id isBlocked isDeleted')
      .select(
        'reporterId reportedUserId conversationId reason createdAt takenAction note actionTakeAt'
      )
      .lean();

    const formattedReports: ReportResponse[] = reports.map((report: any) => ({
      _id: report._id.toString(),
      reporterId: {
        _id: report.reporterId._id.toString(),
        username: report.reporterId.username,
      },
      reportedUserId: {
        _id: report.reportedUserId._id.toString(),
        username: report.reportedUserId.username,
        isBlocked: report.reportedUserId.isBlocked,
        isDeleted: report.reportedUserId.isDeleted,
      },
      conversationId: report.conversationId?.toString() || '',
      reason: report.reason,
      takenAction: report.takenAction,
      note: report.note,
      actionTakeAt: report.actionTakeAt,
      createdAt: report.createdAt,
    }));

    return formattedReports;
  }

  async findDeletedReports(): Promise<ReportResponse[]> {
    const reports = await reportModel
      .find({ status: 'resolved', isDeleted: true })
      .populate('reporterId', 'username _id')
      .populate('reportedUserId', 'username _id isBlocked isDeleted')
      .select(
        'reporterId reportedUserId conversationId reason createdAt takenAction note actionTakeAt'
      )
      .lean();

    const formattedReports: ReportResponse[] = reports.map((report: any) => ({
      _id: report._id.toString(),
      reporterId: {
        _id: report.reporterId._id.toString(),
        username: report.reporterId.username,
      },
      reportedUserId: {
        _id: report.reportedUserId._id.toString(),
        username: report.reportedUserId.username,
        isBlocked: report.reportedUserId.isBlocked,
        isDeleted: report.reportedUserId.isDeleted,
      },
      conversationId: report.conversationId?.toString() || '',
      reason: report.reason,
      takenAction: report.takenAction,
      note: report.note,
      actionTakeAt: report.actionTakeAt,
      createdAt: report.createdAt,
    }));

    return formattedReports;
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
          note,
          status: 'resolved',
          isDeleted,
          actionTakeAt: new Date(),
        },
      }
    );
  }

  async deleteReport(reportId: string): Promise<void> {
    await reportModel.deleteOne({ _id: reportId });
  }
}
