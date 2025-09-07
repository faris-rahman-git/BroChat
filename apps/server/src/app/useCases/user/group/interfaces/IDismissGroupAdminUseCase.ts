import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IDismissGroupAdminUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
