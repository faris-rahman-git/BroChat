import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
    } catch (err) {
      console.log('Error in PrevMessageUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
