import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { IOtpService } from '../../../providers/auth/IOtpService';
import { IPasswordService } from '../../../providers/auth/IPasswordService';
import { IUserWriteRepo } from '../../../repositories/user/IUserWriteRepo';
import { ResetPasswordType } from '../../../dtos/auth';
import { IResetPasswordUseCase } from '../interfaces/IResetPasswordUseCase';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private otpService: IOtpService,
    private passwordService: IPasswordService,
    private userWriteRepo: IUserWriteRepo
  ) {}

  async execute(user: ResetPasswordType): Promise<ResponseDTO> {
    try {
      const otpRes = await this.otpService.validateOtp(user?.email, user?.otp);
      if (!otpRes.success) {
        return otpRes;
      }

      const hashedPassword = await this.passwordService.generatePassword(
        user.password
      );

      await this.userWriteRepo.updateUserPassword(user.email, hashedPassword);

      return { success: true };
    } catch (err: any) {
      console.log('Error in ResetPasswordUseCase: ', err.message);
      return { data: { message: err.message }, success: false };
    }
  }
}
