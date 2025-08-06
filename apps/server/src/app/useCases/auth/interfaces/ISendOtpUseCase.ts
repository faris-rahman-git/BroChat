import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';

export interface ISendOtpUseCase {
  execute(email: string): Promise<ResponseDTO>;
}
