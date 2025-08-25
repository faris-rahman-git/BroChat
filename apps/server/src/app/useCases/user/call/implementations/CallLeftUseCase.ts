import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { ICallLeftUseCase } from '../interfaces/ICallLeftUseCase';
import { callLeftApiType } from '@bro/shared';

export class CallLeftUseCase implements ICallLeftUseCase {
  constructor(private callWriteRepo: ICallWriteRepo) {}

  async execute(userId: string, data: callLeftApiType): Promise<ResponseDTO> {
    try {
      await this.callWriteRepo.callLeft(data.roomId, data.leftAt, userId);

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in CallLeftUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
