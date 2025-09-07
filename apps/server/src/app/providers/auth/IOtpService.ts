import { ResponseDTO } from '../../../domain/entity/return/ResponseDTO';

export interface IOtpService {
  generateOtp(): string;
  validateOtp(email: string, otp: string): Promise<ResponseDTO>;
}
