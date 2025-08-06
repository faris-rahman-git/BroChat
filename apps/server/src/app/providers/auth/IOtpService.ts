import { ResponseDTO } from '../../../domain/dtos/return/ResponseDTO';

export interface IOtpService {
  generateOtp(): string;
  validateOtp(email: string, otp: string): Promise<ResponseDTO>;
}
