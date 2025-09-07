import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { GetAllGroupParams } from '@bro/shared';

export interface IGetAllGroupsUseCase {
  execute(data: GetAllGroupParams): Promise<ResponseDTO>;
}
