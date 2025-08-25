import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ICallReadRepo } from '../../../../repositories/call/ICallReadRepo';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { ICallEndUseCase } from '../interfaces/ICallEndUseCase';
import { callEndApiType } from '@bro/shared';

export class CallEndUseCase implements ICallEndUseCase {
  constructor(
    private callWriteRepo: ICallWriteRepo,
    private eventQueueService: IEventQueueService,
    private callReadRepo: ICallReadRepo
  ) {}

  async execute(userId: string, data: callEndApiType): Promise<ResponseDTO> {
    try {
      await this.callWriteRepo.callEnd(data.roomId, data.endedAt);

      if (data.firstUser) {
        const receiversId = (
          await this.callReadRepo.findCallReceivers(data.roomId)
        ).filter((id) => id.toString() !== userId.toString());

        await Promise.all(
          receiversId.map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'call-cut',
              data: { roomId: data.roomId },
              isDirect: true,
            })
          )
        );
      }

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in CallEndUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
