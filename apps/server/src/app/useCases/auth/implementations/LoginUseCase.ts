import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { ILoginUseCase } from '../interfaces/ILoginUseCase';
import { LoginSchemaType } from '@bro/shared';
import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';
import { IPasswordService } from '../../../providers/auth/IPasswordService';
import { ITokenService } from '../../../providers/auth/ITokenService';
import { IClearQueueService } from '../../../providers/socket/IClearQueueService';

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private passwordService: IPasswordService,
    private tokenService: ITokenService,
    private clearQueueService: IClearQueueService
  ) {}

  async execute(data: LoginSchemaType): Promise<ResponseDTO> {
    try {
      const user = await this.userReadRepo.findEmail(data.email);
      if (!user) {
        return {
          success: false,
          data: { message: AuthMessages.InvalidEmailOrPassword },
          statusCode: 404,
        };
      }

      const isValidPassword = await this.passwordService.validatePassword(
        data.password,
        user.password as string
      );

      if (!isValidPassword) {
        return {
          success: false,
          data: { message: AuthMessages.InvalidEmailOrPassword },
          statusCode: 404,
        };
      }
      if (user.isDeleted) {
        return {
          success: false,
          data: { message: AuthMessages.AccountIsRemoved },
          statusCode: 403,
        };
      }
      if (user.isBlocked) {
        return {
          success: false,
          data: { message: AuthMessages.AccountIsBanned },
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
        data: { user: userDetails },
        cookies: { accessToken, refreshToken },
      };
    } catch (err) {
      console.log('Error in LoginUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
