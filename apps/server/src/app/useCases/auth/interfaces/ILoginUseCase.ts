import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import { LoginSchemaType } from '@bro/shared';

export interface ILoginUseCase {
  execute(data: LoginSchemaType): Promise<ResponseDTO>;
}
