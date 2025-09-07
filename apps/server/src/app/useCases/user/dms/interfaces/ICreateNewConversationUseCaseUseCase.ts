import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface ICreateNewConversationUseCaseUseCase {
  execute(userId: string, receiverId: string): Promise<ResponseDTO>;
}
