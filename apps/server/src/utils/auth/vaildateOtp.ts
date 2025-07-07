import AppError from '../../infrastructure/errors/AppError';
import { getOtp } from '../../infrastructure/services/redis/otpManagement';

export const validateOtp = async (email: string, otp: string) => {
  const storedOtp = await getOtp(email);
  if (storedOtp && storedOtp !== otp) throw new AppError('Invalid OTP', 404);
};
