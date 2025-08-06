import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IExitFromGroupUseCase {
  execute(conversationId: string, userId: string): Promise<ResponseDTO>;
}
