import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportReadRepo } from '../../../../repositories/report/IReportReadRepo';
import { IGetResolvedRepotsUseCase } from '../interfaces/IGetResolvedRepotsUseCase';

export class GetResolvedRepotsUseCase implements IGetResolvedRepotsUseCase {
  constructor(private repReadRepo: IReportReadRepo) {}

  async execute(searchValue: string, page: number): Promise<ResponseDTO> {
    try {
      const reportList = await this.repReadRepo.findResolvedReports(
        searchValue,
        page
      );

      return {
        success: true,
          data: {
            reportList: reportList.data,
            totalPages: reportList.totalPages,
          },
      };
    } catch (err: any) {
      console.log('Error in GetResolvedRepotsUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
