import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ICallReadRepo } from '../../../../repositories/call/ICallReadRepo';
import { ICallListUseCase } from '../interfaces/ICallListUseCase';

export class CallListUseCase implements ICallListUseCase {
  constructor(private callReadRepo: ICallReadRepo) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const callList = await this.callReadRepo.findAllCallList(userId);

      return {
        success: true,
        data: { callList },
      };
    } catch (err: any) {
      console.log('Error in CallListUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
