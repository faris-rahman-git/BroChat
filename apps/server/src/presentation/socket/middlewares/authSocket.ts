import { Socket } from 'socket.io';
import { TokenService } from '../../../infra/providers/auth/TokenService';
import { AuthMessages } from '../../../domain/enums/auth/AuthMessages';

export const authSocket = (socket: Socket, next: (err?: Error) => void) => {
  const cookieHeader = socket.handshake.headers?.cookie;
  if (!cookieHeader) return next(new Error(AuthMessages.CookieNotFound));
  const tokenManager = new TokenService();

  const accessToken = tokenManager.parseToken(cookieHeader);

  if (!accessToken) return next(new Error(AuthMessages.TokenMissing));

  const { valid, decoded } = tokenManager.verifyAccessToken(accessToken);
  if (!valid || !decoded) return next(new Error(AuthMessages.TokenInvalid));

  socket.user = decoded;

  next();
};
