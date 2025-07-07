import { otpAndPasswordBodyType } from '../../../domain/entities/auth';
import { hashPassword } from '../../../utils/auth/hashPassword';
import { validateOtp } from '../../../utils/auth/vaildateOtp';
import { iUserRepo } from '../../interfaces/iUserRepo';

export const resetForgotPassword = async (
  user: Omit<otpAndPasswordBodyType, 'name' | 'phoneNumber' | 'username'>,
  userRepo: iUserRepo
): Promise<void> => {
  await validateOtp(user.email, user.otp);

  const hashedPassword = await hashPassword(user.password);

  await userRepo.updateUserPassword(user.email, hashedPassword);
};
