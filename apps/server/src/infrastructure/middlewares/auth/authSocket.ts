import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { verifyAccessToken } from '../../../utils/auth/verifyTokens';
import { TokenPayload } from '../../../domain/entities/authMiddleware';

export const authSocket = (socket: Socket, next: (err?: Error) => void) => {
  const cookieHeader = socket.handshake.headers?.cookie;
  if (!cookieHeader) return next(new Error('No cookies found'));

  try {
    const parsed = cookie.parse(cookieHeader);

    const accessToken = parsed.accessToken;

    if (!accessToken) return next(new Error('Access token missing'));

    const { valid, decoded } = verifyAccessToken(accessToken);
    if (!valid || !decoded) return next(new Error('Invalid access token'));

    socket.user = decoded as TokenPayload;

    next();
  } catch (err) {
    console.log(err);

    next(new Error('Cookie parse error'));
  }
};
