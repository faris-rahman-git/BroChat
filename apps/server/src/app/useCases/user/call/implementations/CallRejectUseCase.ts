import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
      const callerId = await this.callWriteRepo.rejectCall(userId, data.roomId);

      if (!data.isGroupCall) {
        this.eventQueueService.emitWithQueue({
          userId: callerId,
          event: 'call-end',
          data: { roomId: data.roomId },
          isDirect: true,
        });
      }

      return {
        success: true,
      };
    } catch (err) {
      console.log('Error in CallRejectUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
