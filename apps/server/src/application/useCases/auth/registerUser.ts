import AppError from '../../../infrastructure/errors/AppError';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { sendOtp } from '../../services/auth/sendOtp';

export const registerUser = async (
  email: string,
  userRepo: iUserRepo
): Promise<void> => {
  const user = await userRepo.findEmail(email);
  if (user) throw new AppError('Email Already Taken By Another User', 409);

  await sendOtp(email);
};
