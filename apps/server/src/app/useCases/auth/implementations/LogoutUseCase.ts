import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { ILogoutUseCase } from '../interfaces/ILogoutUseCase';
import { IEventQueueService } from '../../../providers/socket/IEventQueueService';

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private eventQueueService: IEventQueueService) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      await this.eventQueueService.disconnectSocket(userId);

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in LogoutUseCase: ', err.message);

      return { data: { message: err.message }, success: false };
    }
  }
}
