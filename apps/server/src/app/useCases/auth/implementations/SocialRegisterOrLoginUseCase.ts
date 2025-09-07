import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';
import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { SocialRegisterOrLoginType } from '../../../dtos/auth';
import { IUsernameService } from '../../../providers/auth/IUsernameService';
import { IUserWriteRepo } from '../../../repositories/user/IUserWriteRepo';
import { ISocialRegisterOrLoginUseCase } from '../interfaces/ISocialRegisterOrLoginUseCase';
import { ITokenService } from '../../../providers/auth/ITokenService';
import { IClearQueueService } from '../../../providers/socket/IClearQueueService';

export class SocialRegisterOrLoginUseCase
  implements ISocialRegisterOrLoginUseCase
{
  constructor(
    private userReadRepo: IUserReadRepo,
    private tokenService: ITokenService,
    private usernameService: IUsernameService,
    private userWriteRepo: IUserWriteRepo,
    private clearQueueService: IClearQueueService
  ) {}

  async execute(details: SocialRegisterOrLoginType): Promise<ResponseDTO> {
    try {
      let user = await this.userReadRepo.findEmail(details.email);

      if (!user) {
        const username = await this.usernameService.generateUniqueUsername(
          details.name
        );
        user = await this.userWriteRepo.saveUser({
          email: details.email,
          name: details.name,
          username,
        });
      }

      if (user.isDeleted || user.isBlocked) {
        const message = user.isDeleted
          ? AuthMessages.AccountIsRemoved
          : AuthMessages.AccountIsBanned;

        return {
          success: false,
          data: { message },
          statusCode: 403,
        };
      }

      const payload = { email: user.email, role: user.role, id: user._id };
      const accessToken = this.tokenService.createAccessToken(payload);
      const refreshToken = this.tokenService.createRefreshToken(payload);

      await this.clearQueueService.clearInvalidQueueItems(user._id);

      const userDetails = await this.userReadRepo.findUserDetailsById(user._id);

      return {
        success: true,
        data: { ...userDetails },
        cookies: { accessToken, refreshToken },
      };
    } catch (err) {
      console.log('Error in SocialRegisterOrLoginUseCase: ', err);
      return {
        data: { message: (err as Error).message },
        success: false,
        statusCode: 500,
      };
    }
  }
}
