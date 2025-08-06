import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ProfileUpdateInfoParams } from '@bro/shared';

export interface IUpdateProfileInfoUseCase {
  execute(
    userId: string,
    profileInfo: ProfileUpdateInfoParams
  ): Promise<ResponseDTO>;
}
