import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { ICallRejectUseCase } from '../interfaces/ICallRejectUseCase';
import { rejectCallApiType } from '@bro/shared';

export class CallRejectUseCase implements ICallRejectUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
    private callWriteRepo: ICallWriteRepo
  ) {}

  async execute(userId: string, data: rejectCallApiType): Promise<ResponseDTO> {
    try {
      console.log('check CallRejectUseCase 1:', data);
      const callerId = await this.callWriteRepo.rejectCall(userId, data.roomId);
      console.log('check CallRejectUseCase 2:', callerId);

      if (!data.isGroupCall) {
        this.eventQueueService.emitWithQueue({
          userId: callerId,
          event: 'call-reject',
          data: { roomId: data.roomId },
          isDirect: true,
        });
      }

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in CallRejectUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
