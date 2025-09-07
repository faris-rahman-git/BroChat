import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IUnblockUserUseCase } from '../interfaces/IUnblockUserUseCase';

export class UnblockUserUseCase implements IUnblockUserUseCase {
  constructor(
    private userWriteRepo: IUserWriteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(userId: string, conversationId: string): Promise<ResponseDTO> {
    try {
      const result = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );
      const receiverId = result[0];

      await this.userWriteRepo.unblockUser(userId, receiverId);

      await this.eventQueueService.emitWithQueue({
        userId: receiverId,
        event: 'block-user-update',
        data: { conversationId, hasBlockedMe: false },
        isDirect: true,
      });

      return {
        success: true,
      };
    } catch (err) {
      console.log('Error in UnblockUserUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
