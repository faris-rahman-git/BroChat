import { GetAllGroupParams, getAllPaymetsType } from '@bro/shared';

export interface IQueryService {
  searchQuery(searchData: string, status: string, joinedAt: string): any;
  searchQueryForReports(searchData: string, createdAt?: string): any;
  searchQueryForRevenue(data: Omit<getAllPaymetsType, 'page'>): any;
  searchQueryForGroups(data: Omit<GetAllGroupParams, 'page'>): any;
}
