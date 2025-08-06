import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { DeleteGroupParams } from '@bro/shared';

export interface IGroupSoftDeleteManagementUseCase {
  execute(data: DeleteGroupParams): Promise<ResponseDTO>;
}
