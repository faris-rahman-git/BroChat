import reportModel from '../../databases/mongo/db/reportModel';
import { IReportReadRepo } from '../../../app/repositories/report/IReportReadRepo';
import { ReportResponse, ReportSubResponse } from '@bro/shared';

export class ReportReadRepo implements IReportReadRepo {
  async findReports(searchQuery: any, page: number): Promise<ReportResponse> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [reports, countResult] = await Promise.all([
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        {
          $match: searchQuery,
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reporterId',
            foreignField: '_id',
            as: 'reporterId',
          },
        },
        { $unwind: '$reporterId' },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reportedUserId',
            foreignField: '_id',
            as: 'reportedUserId',
          },
        },
        { $unwind: '$reportedUserId' },
        {
          $project: {
            _id: 1,
            conversationId: 1,
            reason: 1,
            createdAt: 1,
            'reporterId._id': 1,
            'reporterId.username': 1,
            'reportedUserId._id': 1,
            'reportedUserId.username': 1,
            'reportedUserId.isBlocked': 1,
            'reportedUserId.isDeleted': 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]),
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        { $match: searchQuery },
        { $count: 'total' },
      ]),
    ]);

    const total = countResult[0]?.total || 0;

    // Format to match ReportResponse[]
    const formattedReports: ReportSubResponse[] = reports.map((report) => ({
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

    return {
      data: formattedReports,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findResolvedReports(
    searchValue: string,
    page: number
  ): Promise<ReportResponse> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const [reports, countResult] = await Promise.all([
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { reason: { $regex: searchValue, $options: 'i' } },
                  {
                    $expr: {
                      $regexMatch: {
                        input: { $toString: '$_id' },
                        regex: searchValue,
                        options: 'i',
                      },
                    },
                  },
                ],
              },
              { status: 'resolved' },
              { isDeleted: false },
            ],
          },
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reporterId',
            foreignField: '_id',
            as: 'reporterId',
          },
        },
        { $unwind: '$reporterId' },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reportedUserId',
            foreignField: '_id',
            as: 'reportedUserId',
          },
        },
        { $unwind: '$reportedUserId' },
        {
          $project: {
            _id: 1,
            conversationId: 1,
            reason: 1,
            createdAt: 1,
            'reporterId._id': 1,
            'reporterId.username': 1,
            'reportedUserId._id': 1,
            'reportedUserId.username': 1,
            'reportedUserId.isBlocked': 1,
            'reportedUserId.isDeleted': 1,
            takenAction: 1,
            note: 1,
            actionTakeAt: 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]),
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { reason: { $regex: searchValue, $options: 'i' } },
                  {
                    $expr: {
                      $regexMatch: {
                        input: { $toString: '$_id' },
                        regex: searchValue,
                        options: 'i',
                      },
                    },
                  },
                ],
              },
              { status: 'resolved' },
              { isDeleted: false },
            ],
          },
        },
        { $count: 'total' },
      ]),
    ]);

    const total = countResult[0]?.total || 0;

    const formattedReports: ReportSubResponse[] = reports.map((report) => ({
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

    return {
      data: formattedReports,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findDeletedReports(
    searchValue: string,
    page: number
  ): Promise<ReportResponse> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [reports, countResult] = await Promise.all([
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { reason: { $regex: searchValue, $options: 'i' } },
                  {
                    $expr: {
                      $regexMatch: {
                        input: { $toString: '$_id' },
                        regex: searchValue,
                        options: 'i',
                      },
                    },
                  },
                ],
              },
              { status: 'resolved' },
              { isDeleted: true },
            ],
          },
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reporterId',
            foreignField: '_id',
            as: 'reporterId',
          },
        },
        { $unwind: '$reporterId' },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'reportedUserId',
            foreignField: '_id',
            as: 'reportedUserId',
          },
        },
        { $unwind: '$reportedUserId' },
        {
          $project: {
            _id: 1,
            conversationId: 1,
            reason: 1,
            createdAt: 1,
            'reporterId._id': 1,
            'reporterId.username': 1,
            'reportedUserId._id': 1,
            'reportedUserId.username': 1,
            'reportedUserId.isBlocked': 1,
            'reportedUserId.isDeleted': 1,
            takenAction: 1,
            note: 1,
            actionTakeAt: 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]),
      reportModel.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { reason: { $regex: searchValue, $options: 'i' } },
                  {
                    $expr: {
                      $regexMatch: {
                        input: { $toString: '$_id' },
                        regex: searchValue,
                        options: 'i',
                      },
                    },
                  },
                ],
              },
              { status: 'resolved' },
              { isDeleted: true },
            ],
          },
        },
        { $count: 'total' },
      ]),
    ]);

    const total = countResult[0]?.total || 0;

    const formattedReports: ReportSubResponse[] = reports.map((report) => ({
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

    return {
      data: formattedReports,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
