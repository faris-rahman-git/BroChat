import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { AuthMessages } from '../../../../../domain/enums/auth/AuthMessages';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IReportWriteRepo } from '../../../../repositories/report/IReportWriteRepo';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IBlockReporedUserUseCase } from '../interfaces/IBlockReporedUserUseCase';

export class BlockReporedUserUseCase implements IBlockReporedUserUseCase {
  constructor(
    private userWriteRepo: IUserWriteRepo,
    private repWriteRepo: IReportWriteRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    reportId: string,
    reportedUserId: string,
    note: string,
  ): Promise<ResponseDTO> {
    try {
      await this.userWriteRepo.updateBlockStatus(reportedUserId, true);

      await this.repWriteRepo.takeActionOnReport(
        reportId,
        note,
        'User Blocked',
        false
      );

      await this.eventQueueService.emitWithQueue({
        userId: reportedUserId,
        event: 'force-logout',
        data: AuthMessages.YourAccountWasBanned,
        isDirect: true,
      });

      return {
        success: true,
        data: { reportId },
      };
    } catch (err: any) {
      console.log('Error in BlockReporedUserUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
