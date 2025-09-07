import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { DeleteGroupParams } from '@bro/shared';

export interface IGroupSoftDeleteManagementUseCase {
  execute(data: DeleteGroupParams): Promise<ResponseDTO>;
}
