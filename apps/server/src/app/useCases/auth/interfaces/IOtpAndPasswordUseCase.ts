import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { ResetPasswordType } from '../../../dtos/auth';

export interface IOtpAndPasswordUseCase {
  execute(user: ResetPasswordType): Promise<ResponseDTO>;
}
