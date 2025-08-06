import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportReadRepo } from '../../../../repositories/report/IReportReadRepo';
import { IGetDeletedRepotsUseCase } from '../interfaces/IGetDeletedRepotsUseCase';

export class GetDeletedRepotsUseCase implements IGetDeletedRepotsUseCase {
  constructor(private repReadRepo: IReportReadRepo) {}

  async execute(searchValue: string, page: number): Promise<ResponseDTO> {
    try {
      const reportList = await this.repReadRepo.findDeletedReports(
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
      console.log('Error in GetDeletedRepotsUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
