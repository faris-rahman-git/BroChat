import { LoginSchemaType } from '@bro/shared';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { validatePassword } from '../../../utils/auth/validatePassword';
import { generateTokens } from '../../services/auth/generateTokens';
import { Response } from 'express';
import AppError from '../../../infrastructure/errors/AppError';
import { cleanUpInvalidQueueEvents } from '../../services/auth/cleanUpInvalidQueueEvents';

export const validateLogin = async (
  res: Response,
  data: LoginSchemaType,
  userRepo: iUserRepo
): Promise<object> => {
  const user = await userRepo.findEmail(data.email);
  if (!user) throw new AppError('Invalid Email or Password', 404);

  const isValidPassword = await validatePassword(
    data.password,
    user.password as string
  );
  if (!isValidPassword) throw new AppError('Invalid Email or Password', 404);
  if (user.isDeleted) throw new AppError('Account is removed!', 403);
  if (user.isBlocked) throw new AppError('Account is banned!', 403);

  const payload = { email: user.email, role: user.role, id: user._id };
  generateTokens(res, payload);

  await cleanUpInvalidQueueEvents(user._id);

  return {
    email: user.email,
    name: user.name,
    id: user._id,
    role: user.role,
  };
};
