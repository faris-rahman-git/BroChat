import { ResponseDTO } from "../../../../../domain/dtos/return/ResponseDTO";

export interface IOneToOneChatListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
