import {
  createAccessToken,
  createRefreshToken,
} from '../../../utils/auth/createJWT';
import { Response } from 'express';
import { sendTokens } from '../../../infrastructure/services/authServices/sendTokens';
import { TokenPayload } from '../../../domain/entities/authMiddleware';

export const generateTokens = (res: Response, payload: TokenPayload) => {
  const cleanPayload = { ...payload };
  delete cleanPayload.exp;
  delete cleanPayload.iat;
  const accessToken = createAccessToken(cleanPayload);
  const refreshToken = createRefreshToken(cleanPayload);
  sendTokens(res, accessToken, refreshToken);
};
