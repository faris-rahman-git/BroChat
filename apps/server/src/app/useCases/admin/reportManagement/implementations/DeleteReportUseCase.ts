import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportWriteRepo } from '../../../../repositories/report/IReportWriteRepo';
import { IDeleteReportUseCase } from '../interfaces/IDeleteReportUseCase';

export class DeleteReportUseCase implements IDeleteReportUseCase {
  constructor(private repWriteRepo: IReportWriteRepo) {}

  async execute(reportId: string, note: string): Promise<ResponseDTO> {
    try {
      await this.repWriteRepo.takeActionOnReport(
        reportId,
        note,
        'Delete Report',
        true
      );

      return {
        success: true,
        data: { reportId },
      };
    } catch (err: any) {
      console.log('Error in DeleteReportUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
