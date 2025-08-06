import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../../infra/providers/auth/TokenService';
import { AuthMessages } from '../../../domain/enums/auth/AuthMessages';

export const authExpress = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ message: AuthMessages.TokenMissing });
    return;
  }

  const tokenManager = new TokenService();
  const { valid, decoded } = tokenManager.verifyAccessToken(accessToken);

  if (!valid || !decoded) {
    res.status(403).json({ message: AuthMessages.TokenInvalid });
    return;
  }
  req.user = decoded;
  next();
};
