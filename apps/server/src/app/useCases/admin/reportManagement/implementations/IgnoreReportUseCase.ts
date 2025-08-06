import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportWriteRepo } from '../../../../repositories/report/IReportWriteRepo';
import { IIgnoreReportUseCase } from '../interfaces/IIgnoreReportUseCase';

export class IgnoreReportUseCase implements IIgnoreReportUseCase {
  constructor(private repWriteRepo: IReportWriteRepo) {}

  async execute(reportId: string, note: string): Promise<ResponseDTO> {
    try {
      await this.repWriteRepo.takeActionOnReport(
        reportId,
        note,
        'No Action Taken',
        false
      );

      return {
        success: true,
        data: { reportId },
      };
    } catch (err: any) {
      console.log('Error in IgnoreReportUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
