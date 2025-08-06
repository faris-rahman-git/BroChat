import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { LoginSchemaType } from '@bro/shared';

export interface ILoginUseCase {
  execute(data: LoginSchemaType): Promise<ResponseDTO>;
}
