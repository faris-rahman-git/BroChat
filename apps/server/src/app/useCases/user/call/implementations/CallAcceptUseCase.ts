import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { ICallAcceptUseCase } from '../interfaces/ICallAcceptUseCase';
import { acceptCallApiType } from '@bro/shared';

export class CallAcceptUseCase implements ICallAcceptUseCase {
  constructor(private callWriteRepo: ICallWriteRepo) {}

  async execute(userId: string, data: acceptCallApiType): Promise<ResponseDTO> {
    try {
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
