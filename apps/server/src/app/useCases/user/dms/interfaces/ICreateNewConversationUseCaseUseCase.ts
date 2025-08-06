import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface ICreateNewConversationUseCaseUseCase {
  execute(userId: string, receiverId: string): Promise<ResponseDTO>;
}
