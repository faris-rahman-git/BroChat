import { ResponseDTO } from "../../../../../domain/entity/return/ResponseDTO";

export interface IOneToOneChatListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
