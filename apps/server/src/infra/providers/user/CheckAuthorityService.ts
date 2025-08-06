import { ICheckAuthorityService } from '../../../app/providers/user/ICheckAuthorityService';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';

export class CheckAuthorityService implements ICheckAuthorityService {
  constructor(private conReadRepo: IConversationReadRepo) {}

  async checkIsAdmin(conversationId: string, userId: string): Promise<boolean> {
    const adminIds = await this.conReadRepo.findGroupAdminIds(conversationId);
    return adminIds.includes(userId);
  }

}
