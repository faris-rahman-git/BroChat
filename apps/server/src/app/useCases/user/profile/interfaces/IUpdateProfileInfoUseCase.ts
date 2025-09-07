import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { ProfileUpdateInfoParams } from '@bro/shared';

export interface IUpdateProfileInfoUseCase {
  execute(
    userId: string,
    profileInfo: ProfileUpdateInfoParams
  ): Promise<ResponseDTO>;
}
