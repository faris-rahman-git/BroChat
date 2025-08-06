import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import {  hardDeleteGroupParams } from '@bro/shared';

export interface IHardDeleteGroupUseCase {
  execute(data: hardDeleteGroupParams): Promise<ResponseDTO>;
}
