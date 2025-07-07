import AppError from '../../../infrastructure/errors/AppError';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { sendOtp } from '../../services/auth/sendOtp';

export const forgotPasswordOtp = async (
  email: string,
  userRepo: iUserRepo
): Promise<void> => {
  const user = await userRepo.findEmail(email);
  if (!user) throw new AppError('Inalid Email Address', 404);

  await sendOtp(email);
};
