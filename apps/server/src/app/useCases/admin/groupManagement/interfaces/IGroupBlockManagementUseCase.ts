import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { BlockGroupParams } from '@bro/shared';

export interface IGroupBlockManagementUseCase {
  execute(data: BlockGroupParams): Promise<ResponseDTO>;
}
