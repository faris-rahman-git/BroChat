export type UserRef = {
  _id: string;
  username: string;
};

export type ReportResponse = {
  data: ReportSubResponse[];
  totalPages: number;
};

export type ReportSubResponse = {
  _id: string;
  reporterId: UserRef;
  reportedUserId: {
    _id: string;
    username: string;
    isBlocked: boolean;
    isDeleted: boolean;
  };
  conversationId: string;
  reason: string;
  takenAction?: string;
  note?: string;
  actionTakeAt?: Date;
  createdAt: Date;
};

export type GetReportParams = {
  searchValue?: string;
  createdAt?: string;
  page: number;
};
