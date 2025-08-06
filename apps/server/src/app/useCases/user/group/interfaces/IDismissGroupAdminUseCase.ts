import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IDismissGroupAdminUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
