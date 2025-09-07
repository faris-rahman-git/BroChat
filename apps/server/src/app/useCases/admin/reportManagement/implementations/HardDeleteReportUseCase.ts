import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
    } catch (err) {
      console.log('Error in hardDeleteReportUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
