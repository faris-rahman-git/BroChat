import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
    } catch (err) {
      console.log('Error in GetResolvedRepotsUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
