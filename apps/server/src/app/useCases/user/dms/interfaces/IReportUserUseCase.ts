import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IReportUserUseCase {
  execute(
    userId: string,
    conversationId: string,
    reason: string,
    reportedUserId: string
  ): Promise<ResponseDTO>;
}
