import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { BlockGroupParams } from '@bro/shared';

export interface IGroupBlockManagementUseCase {
  execute(data: BlockGroupParams): Promise<ResponseDTO>;
}
