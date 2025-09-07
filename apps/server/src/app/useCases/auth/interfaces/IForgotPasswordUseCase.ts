import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export interface IForgotPasswordUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
