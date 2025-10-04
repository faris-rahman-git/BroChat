import { ICheckAuthorityService } from '../../../app/providers/user/ICheckAuthorityService';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';
import { IPaymentReadRepo } from '../../../app/repositories/payment/IPaymentReadRepo';

export class CheckAuthorityService implements ICheckAuthorityService {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private paymentReadRepo: IPaymentReadRepo
  ) {}

  async checkIsAdmin(conversationId: string, userId: string): Promise<boolean> {
    const adminIds = await this.conReadRepo.findGroupAdminIds(conversationId);
    return adminIds.includes(userId);
  }

  async verifyExclusivePlanPayment(userId: string): Promise<boolean> {
    const payment = await this.paymentReadRepo.findExclusivePayment(userId);
    return !!payment;
  }
}
