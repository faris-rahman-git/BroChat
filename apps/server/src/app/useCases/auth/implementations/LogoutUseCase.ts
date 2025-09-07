import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
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
    } catch (err) {
      console.log('Error in LogoutUseCase: ', err);

      return { data: { message: (err as Error).message }, success: false };
    }
  }
}
