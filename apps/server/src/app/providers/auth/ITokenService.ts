import {
  CustomPayloadType,
  VerifyTokensType,
} from '../../../domain/entity/auth/authTypes';

export interface ITokenService {
  createAccessToken(payload: CustomPayloadType): string;
  createRefreshToken(payload: CustomPayloadType): string;
  verifyAccessToken(token: string): VerifyTokensType;
  verifyRefreshToken(token: string): VerifyTokensType;
  parseToken(cookieHeader: string | undefined): string | undefined ;
}
