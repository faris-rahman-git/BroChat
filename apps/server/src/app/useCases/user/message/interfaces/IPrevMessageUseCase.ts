import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IPrevMessageUseCase {
  execute(conversationId: string, userId: string): Promise<ResponseDTO>;
}
