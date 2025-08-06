import { ISendOtpUseCase } from '../interfaces/ISendOtpUseCase';

import { IEmailService } from '../../../providers/auth/IEmailService';
import { IOtpManagementRepo } from '../../../repositories/redis/IOtpManagementRepo';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { IOtpService } from '../../../providers/auth/IOtpService';

export class SendOtpUseCase implements ISendOtpUseCase {
  constructor(
    private otpService: IOtpService,
    private emailService: IEmailService,
    private otpRepository: IOtpManagementRepo
  ) {}

  async execute(email: string): Promise<ResponseDTO> {
    const otp = this.otpService.generateOtp();

    try {
      await this.emailService.sendOtpEmail(email, otp);
      await this.otpRepository.saveOtp(email, otp);
      return { success: true };
    } catch (err: any) {
      console.log('Error in SendOtpUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
