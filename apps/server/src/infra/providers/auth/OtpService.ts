import { IOtpService } from '../../../app/providers/auth/IOtpService';
import { IOtpManagementRepo } from '../../../app/repositories/redis/IOtpManagementRepo';
import { ResponseDTO } from '../../../domain/dtos/return/ResponseDTO';
import { AuthMessages } from '../../../domain/enums/auth/AuthMessages';

export class OtpService implements IOtpService {
  constructor(private otpRepository: IOtpManagementRepo) {}

  generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  async validateOtp(email: string, otp: string): Promise<ResponseDTO> {
    try {
      const storedOtp = await this.otpRepository.getOtp(email);
      if (storedOtp && storedOtp !== otp) {
        return {
          success: false,
          data: { message: AuthMessages.InvalidOtp },
        };
      } else {
        return {
          success: true,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
