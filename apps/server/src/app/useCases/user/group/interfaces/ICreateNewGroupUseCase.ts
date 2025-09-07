import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { CreateGroupInputType } from '../../../../dtos/group';

export interface ICreateNewGroupUseCase {
  execute(groupDetails: CreateGroupInputType , userId : string): Promise<ResponseDTO>;
}
