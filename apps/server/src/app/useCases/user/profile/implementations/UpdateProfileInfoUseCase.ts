import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ProfileMessage } from '../../../../../domain/enums/user/ProfileMessage';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IUpdateProfileInfoUseCase } from '../interfaces/IUpdateProfileInfoUseCase';
import { ProfileUpdateInfoParams } from '@bro/shared';

export class UpdateProfileInfoUseCase implements IUpdateProfileInfoUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private userWriteRepo: IUserWriteRepo,
    private conReadRepo: IConversationReadRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    userId: string,
    profileInfo: ProfileUpdateInfoParams
  ): Promise<ResponseDTO> {
    try {
      const ExistedUserId = await this.userReadRepo.findUsername(
        profileInfo.username
      );
      if (ExistedUserId && ExistedUserId !== userId) {
        return {
          success: false,
          data: {
            message: ProfileMessage.Username_Already_Exists,
          },
        };
      }
      await this.userWriteRepo.updateProfileInfo(userId, profileInfo);

      // emit friends
      const userChatList = await this.conReadRepo.findDMsIds(userId);
      await Promise.all(
        userChatList.map((id) =>
          this.eventQueueService.emitWithQueue({
            userId: id,
            event: 'update-profile-info',
            data: {
              userId,
              profileInfo,
            },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in UpdateProfileInfoUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
