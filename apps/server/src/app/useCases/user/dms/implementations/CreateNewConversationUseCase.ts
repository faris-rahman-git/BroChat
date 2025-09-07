import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { ICreateNewConversationUseCaseUseCase } from '../interfaces/ICreateNewConversationUseCaseUseCase';

export class CreateNewConversationUseCase
  implements ICreateNewConversationUseCaseUseCase
{
  constructor(
    private conReadRepo: IConversationReadRepo,
    private conWriteRepo: IConversationWriteRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(userId: string, receiverId: string): Promise<ResponseDTO> {
    try {
      const conversationExist = await this.conReadRepo.checkConversationExists(
        userId,
        receiverId
      );

      if (conversationExist) {
        return {
          success: true,
          data: { newConversationId: conversationExist },
        };
      }

      const newConversationId = await this.conWriteRepo.createNewConversation(
        userId,
        receiverId
      );

      await this.eventQueueService.emitNewUser(
        userId,
        receiverId,
        newConversationId
      );


      return {
        success: true,
        data: { newConversationId },
      };
    } catch (err) {
      console.log('Error in CreateNewConversationUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
