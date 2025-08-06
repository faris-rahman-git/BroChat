import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';

import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { ISendOtpUseCase } from '../interfaces/ISendOtpUseCase';
import { IForgotPasswordUseCase } from '../interfaces/IForgotPasswordUseCase';

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private userRepo: IUserReadRepo,
    private sendOtpUseCase: ISendOtpUseCase
  ) {}

  async execute(email: string): Promise<ResponseDTO> {
    try {
      const user = await this.userRepo.findEmail(email);

      if (!user) {
        return {
          success: false,
          data: { message: AuthMessages.InvalidEmail },
          statusCode: 404,
        };
      }

      const response = await this.sendOtpUseCase.execute(email);

      return { data: response.data, success: response.success };
    } catch (err: any) {
      console.log('Error in ForgotPasswordUseCase: ', err.message);

      return { data: { message: err.message }, success: false };
    }
  }
}
