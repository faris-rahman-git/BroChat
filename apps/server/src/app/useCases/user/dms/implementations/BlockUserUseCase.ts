import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IBlockUserUseCase } from '../interfaces/IBlockUserUseCase';

export class BlockUserUseCase implements IBlockUserUseCase {
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

      await this.userWriteRepo.blockUser(userId, receiverId);

      await this.eventQueueService.emitWithQueue({
        userId: receiverId,
        event: 'block-user-update',
        data: { conversationId, hasBlockedMe: true },
        isDirect: true,
      });

      return {
        success: true,
      };
    } catch (err) {
      console.log('Error in BlockUserUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
