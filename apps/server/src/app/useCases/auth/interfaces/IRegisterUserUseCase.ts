import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';

export interface IRegisterUserUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
