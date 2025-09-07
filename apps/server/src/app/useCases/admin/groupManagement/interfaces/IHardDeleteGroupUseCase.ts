import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import {  hardDeleteGroupParams } from '@bro/shared';

export interface IHardDeleteGroupUseCase {
  execute(data: hardDeleteGroupParams): Promise<ResponseDTO>;
}
