import { verifyRefreshToken } from '../../../utils/auth/verifyTokens';
import { Response } from 'express';
import { generateTokens } from '../../services/auth/generateTokens';
import { TokenPayload } from '../../../domain/entities/authMiddleware';

export const verifyAndResendTokens = (
  res: Response,
  refreshToken: string
): boolean => {
  const { valid, decoded } = verifyRefreshToken(refreshToken);
  if (!valid || !decoded) return false;

  generateTokens(res, decoded as TokenPayload);
  return true;
};
