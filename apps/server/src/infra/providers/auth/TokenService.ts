import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { ITokenService } from '../../../app/providers/auth/ITokenService';
import {
  CustomPayloadType,
  VerifyTokensType,
} from '../../../domain/dtos/auth/authTypes';

export class TokenService implements ITokenService {
  createAccessToken(payload: CustomPayloadType): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
  }

  createRefreshToken(payload: CustomPayloadType): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }

  verifyAccessToken(token: string): VerifyTokensType {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as jwt.JwtPayload;

      if (!decoded || typeof decoded !== 'object') {
        return { valid: false, decoded: null };
      }

      const { id, email, name, role } = decoded as CustomPayloadType;

      return { valid: true, decoded: { id, email, name, role } };
    } catch (err) {
      return { valid: false, decoded: null };
    }
  }

  verifyRefreshToken(token: string): VerifyTokensType {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as jwt.JwtPayload;

      if (!decoded || typeof decoded !== 'object') {
        return { valid: false, decoded: null };
      }

      const { id, email, name, role } = decoded as CustomPayloadType;

      return { valid: true, decoded: { id, email, name, role } };
    } catch (err) {
      return { valid: false, decoded: null };
    }
  }

  parseToken(cookieHeader: string): string | undefined {
    const parsed = cookie.parse(cookieHeader);
    return parsed.accessToken;
  }
}
