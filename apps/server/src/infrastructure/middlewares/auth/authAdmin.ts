import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../utils/auth/verifyTokens';
import { TokenPayload } from '../../../domain/entities/authMiddleware';

export const authAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: 'Access token missing' });
      return;
    }

    const { valid, decoded } = verifyAccessToken(accessToken);

    if (!valid || !decoded || (decoded as TokenPayload).role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized: Admin access only' });
      return;
    }

    req.user = decoded as TokenPayload;
    next();
  } catch (err) {
    console.error('Admin Auth error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
