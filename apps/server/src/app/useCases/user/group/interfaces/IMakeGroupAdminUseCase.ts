import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IMakeGroupAdminUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
