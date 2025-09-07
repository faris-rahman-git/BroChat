import { IRegisterUserUseCase } from '../interfaces/IRegisterUserUseCase';
import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';

import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';
import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { ISendOtpUseCase } from '../interfaces/ISendOtpUseCase';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private userRepo: IUserReadRepo,
    private sendOtpUseCase: ISendOtpUseCase
  ) {}

  async execute(email: string): Promise<ResponseDTO> {
    try {
      const user = await this.userRepo.findEmail(email);

      if (user) {
        return {
          success: false,
          data: { message: AuthMessages.EmailAlreadyTaken },
        };
      }

      const response = await this.sendOtpUseCase.execute(email);

      return { data: response.data, success: response.success };
    } catch (err) {
      console.log('Error in RegisterUserUseCase: ', err);

      return { data: { message: (err as Error).message }, success: false };
    }
  }
}
