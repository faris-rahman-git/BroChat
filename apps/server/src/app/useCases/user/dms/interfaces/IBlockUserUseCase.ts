import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IBlockUserUseCase {
  execute(userId: string, conversationId: string): Promise<ResponseDTO>;
}
