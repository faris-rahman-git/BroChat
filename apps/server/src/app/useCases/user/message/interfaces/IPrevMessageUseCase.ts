import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IPrevMessageUseCase {
  execute(conversationId: string, userId: string): Promise<ResponseDTO>;
}
