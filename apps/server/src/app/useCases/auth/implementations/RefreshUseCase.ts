import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { IRefreshUseCase } from '../interfaces/IRefreshUseCase';
import { ITokenService } from '../../../providers/auth/ITokenService';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';

export class RefreshUseCase implements IRefreshUseCase {
  constructor(private tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<ResponseDTO> {
    try {
      const { valid, decoded } =
        this.tokenService.verifyRefreshToken(refreshToken);

      if (!valid || !decoded) {
        return {
          success: false,
          data: { message: AuthMessages.RefrechTokenInvalid },
        };
      }

      const payload = {
        email: decoded.email,
        role: decoded.role,
        id: decoded.id,
      };
      const newAccessToken = this.tokenService.createAccessToken(payload);
      const newRefreshToken = this.tokenService.createRefreshToken(payload);

      return {
        success: true,
        cookies: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      };
    } catch (err: any) {
      console.log('Error in RefreshUseCase: ', err.message);
      return { data: { message: err.message }, success: false };
    }
  }
}
