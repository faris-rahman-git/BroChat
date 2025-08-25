import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ICallInviteUseCase } from '../interfaces/ICallInviteUseCase';
import { CallInvite } from '@bro/shared';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ICallWriteRepo } from '../../../../repositories/call/ICallWriteRepo';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';

export class CallInviteUseCase implements ICallInviteUseCase {
  constructor(
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private callWriteRepo: ICallWriteRepo,
    private conReadRepo: IConversationReadRepo
  ) {}

  async execute(userId: string, data: CallInvite): Promise<ResponseDTO> {
    try {
      const receiverIds = await this.receiverService.getReceiverIds(
        data.conversationId,
        userId
      );

      await this.callWriteRepo.saveCall(userId, data, [userId ,...receiverIds]);

      const userdata = await this.conReadRepo.findConversationName(
        data.conversationId,
        userId
      );

      await Promise.all(
        receiverIds.map((id) =>
          this.eventQueueService.emitWithQueue({
            userId: id,
            event: 'call-invite',
            data: {
              userdata,
              callUrl: data.callUrl,
              isVideoCall: data.isVideoCall,
              isGroupCall: data.isGroupCall,
              roomId: data.roomId,
            },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
        data: {
          callUrl: data.callUrl,
        },
      };
    } catch (err: any) {
      console.log('Error in CallInviteUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
