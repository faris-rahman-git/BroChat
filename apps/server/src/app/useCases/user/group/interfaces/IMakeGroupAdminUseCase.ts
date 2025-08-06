import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IMakeGroupAdminUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
