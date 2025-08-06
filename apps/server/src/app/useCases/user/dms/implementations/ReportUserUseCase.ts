import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IReportWriteRepo } from '../../../../repositories/report/IReportWriteRepo';
import { IReportUserUseCase } from '../interfaces/IReportUserUseCase';

export class ReportUserUseCase implements IReportUserUseCase {
  constructor(private reportWriteRepo: IReportWriteRepo) {}

  async execute(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<ResponseDTO> {
    try {
      await this.reportWriteRepo.reportUser(
        userId,
        conversationId,
        reason,
        reportedUserId
      );

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in ReportUserUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
