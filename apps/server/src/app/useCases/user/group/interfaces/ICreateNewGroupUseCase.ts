import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { CreateGroupInputType } from '../../../../dtos/group';

export interface ICreateNewGroupUseCase {
  execute(groupDetails: CreateGroupInputType , userId : string): Promise<ResponseDTO>;
}
