import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { ResetPasswordType } from '../../../dtos/auth';

export interface IResetPasswordUseCase {
  execute(user: ResetPasswordType): Promise<ResponseDTO>;
}
