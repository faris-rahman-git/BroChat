import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IReportUserUseCase {
  execute(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<ResponseDTO>;
}
