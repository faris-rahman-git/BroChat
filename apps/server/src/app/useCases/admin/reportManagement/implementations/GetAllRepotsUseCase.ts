import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IReportReadRepo } from '../../../../repositories/report/IReportReadRepo';
import { IGetAllRepotsUseCase } from '../interfaces/IGetAllRepotsUseCase';
import { GetReportParams } from '@bro/shared';

export class GetAllRepotsUseCase implements IGetAllRepotsUseCase {
  constructor(
    private repReadRepo: IReportReadRepo,
    private queryService: IQueryService
  ) {}

  async execute(data: GetReportParams): Promise<ResponseDTO> {
    try {
      const searchQuery = this.queryService.searchQueryForReports(
        data.searchValue?.trim() ?? '',
        data.createdAt
      );

      const reportList = await this.repReadRepo.findReports(
        searchQuery,
        data.page
      );

      return {
        success: true,
        data: {
          reportList: reportList.data,
          totalPages: reportList.totalPages,
        },
      };
    } catch (err: any) {
      console.log('Error in GetAllRepotsUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
