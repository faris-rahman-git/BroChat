import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IExitFromGroupUseCase {
  execute(conversationId: string, userId: string): Promise<ResponseDTO>;
}
