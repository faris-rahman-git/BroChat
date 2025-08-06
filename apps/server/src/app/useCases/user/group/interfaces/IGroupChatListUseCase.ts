import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGroupChatListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
