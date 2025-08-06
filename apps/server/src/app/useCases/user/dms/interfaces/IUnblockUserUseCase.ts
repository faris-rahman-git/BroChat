import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IUnblockUserUseCase {
  execute(userId: string, conversationId: string): Promise<ResponseDTO>;
}
