import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { VerifyInType } from '@bro/shared';

export interface IVerifyUseCase {
  execute(data: VerifyInType , userId: string): Promise<ResponseDTO>;
}
