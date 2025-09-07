import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGroupChatListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
