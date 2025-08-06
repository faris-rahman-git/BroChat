import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';

export interface IForgotPasswordUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
