import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ICallReadRepo } from '../../../../repositories/call/ICallReadRepo';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { ICallAcceptUseCase } from '../interfaces/ICallAcceptUseCase';
import { acceptCallApiType } from '@bro/shared';

export class CallAcceptUseCase implements ICallAcceptUseCase {
  constructor(
    private callWriteRepo: ICallWriteRepo,
    private callReadRepo: ICallReadRepo
  ) {}

  async execute(userId: string, data: acceptCallApiType): Promise<ResponseDTO> {
    try {
      const isStarted = await this.callReadRepo.findCallStarted(data.roomId);
      if (!isStarted) {
        await this.callWriteRepo.startACall(data.roomId, data.joinedAt);
      }

      await this.callWriteRepo.acceptCall(data.roomId, userId, data.joinedAt);

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in CallAcceptUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
