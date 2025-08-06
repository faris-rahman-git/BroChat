import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportDeleteRepo } from '../../../../repositories/report/IReportDeleteRepo';
import { IHardDeleteReportUseCase } from '../interfaces/IHardDeleteReportUseCase';

export class HardDeleteReportUseCase implements IHardDeleteReportUseCase {
  constructor(private repDeleteRepo: IReportDeleteRepo) {}

  async execute(reportId: string): Promise<ResponseDTO> {
    try {
      await this.repDeleteRepo.deleteReport(reportId);

      return {
        success: true,
        data: { reportId },
      };
    } catch (err: any) {
      console.log('Error in hardDeleteReportUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
