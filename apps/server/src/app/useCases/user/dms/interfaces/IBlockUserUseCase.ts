import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IBlockUserUseCase {
  execute(userId: string, conversationId: string): Promise<ResponseDTO>;
}
