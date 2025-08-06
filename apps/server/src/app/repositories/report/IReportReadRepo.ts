import { ReportResponse } from '@bro/shared';

export interface IReportReadRepo {
  findReports(searchQuery: any, page: number): Promise<ReportResponse>;
  findResolvedReports(
    searchValue: string,
    page: number
  ): Promise<ReportResponse>;
  findDeletedReports(
    searchValue: string,
    page: number
  ): Promise<ReportResponse>;
}
