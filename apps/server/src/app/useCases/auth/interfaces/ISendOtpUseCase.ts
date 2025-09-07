import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export interface ISendOtpUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
