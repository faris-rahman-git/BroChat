import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { VerifyInType } from '@bro/shared';

export interface IVerifyUseCase {
  execute(data: VerifyInType , userId: string): Promise<ResponseDTO>;
}
