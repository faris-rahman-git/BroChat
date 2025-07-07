import { iUserRepo } from '../../interfaces/iUserRepo';
import { generateTokens } from '../../services/auth/generateTokens';
import { Response } from 'express';
import { generateUniqueUsername } from '../../services/home/generateUniqueUsername';
import { cleanUpInvalidQueueEvents } from '../../services/auth/cleanUpInvalidQueueEvents';

export const socialAuthHandler = async (
  res: Response,
  email: string,
  name: string,
  userRepo: iUserRepo
) => {
  let user = await userRepo.findEmail(email);
  if (!user) {
    const username = await generateUniqueUsername(name, userRepo);
    user = await userRepo.saveUser({ email, name, username })!;
  }
  if (user.isDeleted || user.isBlocked) {
    const message = user.isDeleted ? 'Account is removed' : 'Account is banned';
    return res.redirect(
      `${process.env.CLIENT_URL}/auth-error?message=${encodeURIComponent(
        message
      )}`
    );
  }

  const payload = { email: user.email, role: user.role, id: user._id };
  generateTokens(res, payload);

  await cleanUpInvalidQueueEvents(user._id);

  return {
    email: user.email,
    role: user.role,
    id: user._id,
    name: user.name,
  };
};
