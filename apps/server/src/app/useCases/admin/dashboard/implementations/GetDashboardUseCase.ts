import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IMessageReadRepo } from '../../../../repositories/message/IMessageReadRepo';
import { IPaymentReadRepo } from '../../../../repositories/payment/IPaymentReadRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IGetDashboardUseCase } from '../interfaces/IGetDashboardUseCase';

export class GetDashboardUseCase implements IGetDashboardUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private conversationReadRepo: IConversationReadRepo,
    private paymentReadRepo: IPaymentReadRepo,
    private messageReadRepo: IMessageReadRepo
  ) {}

  async execute(): Promise<ResponseDTO> {
    try {
      const userCount = await this.userReadRepo.findUserCounts();
      const personalchatCount =
        await this.conversationReadRepo.findPersonalChatCounts();
      const groupChatCount =
        await this.conversationReadRepo.findGroupChatCounts();
      const revenueCount = await this.paymentReadRepo.findTotalRevenue();

      const userState = await this.userReadRepo.getUserStatsData();
      const chatState = await this.messageReadRepo.getChatStatsData();
      const groupState = await this.conversationReadRepo.getGroupStatsData();
      const revenueState = await this.paymentReadRepo.getRevenueStats();

      return {
        success: true,
        data: {
          userCount,
          personalchatCount,
          groupChatCount,
          revenueCount,
          userState,
          chatState,
          groupState,
          revenueState,
        },
      };
    } catch (err: any) {
      console.log('Error in GetDashboardUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
