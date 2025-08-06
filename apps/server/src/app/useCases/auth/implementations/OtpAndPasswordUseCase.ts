import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';
import { IOtpAndPasswordUseCase } from '../interfaces/IOtpAndPasswordUseCase';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { otpAndPasswordBodyType } from '../../../dtos/auth';
import { IOtpService } from '../../../providers/auth/IOtpService';
import { IPasswordService } from '../../../providers/auth/IPasswordService';
import { IUsernameService } from '../../../providers/auth/IUsernameService';
import { IUserWriteRepo } from '../../../repositories/user/IUserWriteRepo';

export class OtpAndPasswordUseCase implements IOtpAndPasswordUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private otpService: IOtpService,
    private passwordService: IPasswordService,
    private usernameService: IUsernameService,
    private userWriteRepo: IUserWriteRepo
  ) {}

  async execute(user: otpAndPasswordBodyType): Promise<ResponseDTO> {
    try {
      const ExistingUser = await this.userReadRepo.findEmail(user?.email);

      if (ExistingUser) {
        return {
          success: false,
          data: { message: AuthMessages.EmailAlreadyTaken },
        };
      }

      const otpRes = await this.otpService.validateOtp(user?.email, user?.otp);
      if (!otpRes.success) {
        return otpRes;
      }

      const hashedPassword = await this.passwordService.generatePassword(
        user.password
      );

      const username = await this.usernameService.generateUniqueUsername(
        user.name
      );

      await this.userWriteRepo.saveUser({
        name: user.name,
        username: username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: hashedPassword,
      });

      return { success: true };
    } catch (err: any) {
      console.log('Error in OtpAndPasswordUseCase: ', err.message);
      return { data: { message: err.message }, success: false };
    }
  }
}
