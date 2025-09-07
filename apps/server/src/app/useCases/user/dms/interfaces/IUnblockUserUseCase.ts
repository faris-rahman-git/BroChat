import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IUnblockUserUseCase {
  execute(userId: string, conversationId: string): Promise<ResponseDTO>;
}
