import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { GetDeletedGroupsParams } from '@bro/shared';

export interface IGetDeletedGroupsUseCase {
  execute(data: GetDeletedGroupsParams): Promise<ResponseDTO>;
}
