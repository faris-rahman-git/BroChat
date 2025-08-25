import { Request, Response, NextFunction } from 'express';
import { AuthMessages } from '../../../domain/enums/auth/AuthMessages';
import { TokenService } from '../../../infra/providers/auth/TokenService';
import { Role } from '../../../domain/enums/common/role';

export const authAdmin = (
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

  if (!valid || !decoded || decoded.role !== Role.Admin) {
    res.status(403).json({ message: AuthMessages.AdminOnly });
    return;
  }

  req.user = decoded;
  next();
};
