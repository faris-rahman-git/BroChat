import { otpAndPasswordBodyType } from '../../../domain/entities/auth';
import AppError from '../../../infrastructure/errors/AppError';
import { hashPassword } from '../../../utils/auth/hashPassword';
import { validateOtp } from '../../../utils/auth/vaildateOtp';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { generateUniqueUsername } from '../../services/home/generateUniqueUsername';

export const createUser = async (
  user: otpAndPasswordBodyType,
  userRepo: iUserRepo
): Promise<void> => {
  const ExistingUser = await userRepo.findEmail(user.email);
  if (ExistingUser)
    throw new AppError('Email Already Taken By Another User', 409);

  await validateOtp(user.email, user.otp);

  const hashedPassword = await hashPassword(user.password);

  const username = await generateUniqueUsername(user.name, userRepo);

  await userRepo.saveUser({
    name: user.name,
    username: username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: hashedPassword,
  });
};
