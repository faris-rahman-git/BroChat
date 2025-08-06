import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IMessageReadRepo } from '../../../../repositories/message/IMessageReadRepo';
import { IPrevMessageUseCase } from '../interfaces/IPrevMessageUseCase';

export class PrevMessageUseCase implements IPrevMessageUseCase {
  constructor(private mesReadRepo: IMessageReadRepo) {}

  async execute(conversationId: string, userId: string): Promise<ResponseDTO> {
    try {
      const messages = await this.mesReadRepo.findMessages(
        conversationId,
        userId
      );

      return {
        success: true,
        data: { messages },
      };
    } catch (err: any) {
      console.log('Error in PrevMessageUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
