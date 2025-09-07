import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export interface IRegisterUserUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
