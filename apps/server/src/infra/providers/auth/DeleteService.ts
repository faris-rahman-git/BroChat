import { IDeleteService } from '../../../app/providers/auth/IDeleteService';
import { IConversationDeleteRepo } from '../../../app/repositories/conversation/IConversationDeleteRepo';
import { IMessageDeleteRepo } from '../../../app/repositories/message/IMessageDeleteRepo';
import { IReportDeleteRepo } from '../../../app/repositories/report/IReportDeleteRepo';
import { IUserDeleteRepo } from '../../../app/repositories/user/IUserDeleteRepo';

export class DeleteService implements IDeleteService {
  constructor(
    private userDeleteRepo: IUserDeleteRepo,
    private mesDeleteRepo: IMessageDeleteRepo,
    private conDeleteRepo: IConversationDeleteRepo,
    private repDeleteRepo: IReportDeleteRepo
  ) {}

  async deleteUserFromAllModels(userId: string): Promise<void> {
    await this.userDeleteRepo.deleteUser(userId);
    await this.mesDeleteRepo.deleteMessageBySenderId(userId);
    await this.conDeleteRepo.deleteAllOneToOneConversationByuserId(userId);
    await this.conDeleteRepo.removeUserFromAllGroups(userId);
    await this.repDeleteRepo.deleteReportRelatedToAUser(userId);
  }
}
