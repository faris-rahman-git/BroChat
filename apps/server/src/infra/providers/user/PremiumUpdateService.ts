import { iReceiverService } from '../../../app/providers/common/iReceiverService';
import { IEventQueueService } from '../../../app/providers/socket/IEventQueueService';
import { IPremiumUpdateService } from '../../../app/providers/user/IPremiumUpdateService';
import { IConversationWriteRepo } from '../../../app/repositories/conversation/IConversationWriteRepo';
import { SubscriptionDetailsType } from '@bro/shared';
import { IUserWriteRepo } from '../../../app/repositories/user/IUserWriteRepo';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';

export class PremiumUpdateService implements IPremiumUpdateService {
  constructor(
    private conWriteRepo: IConversationWriteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private userWriteRepo: IUserWriteRepo,
    private conReadRepo: IConversationReadRepo
  ) {}

  async updatePremiumGroup(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await this.conWriteRepo.updatePaidStatus(conversationId);

    const receiversId = await this.receiverService.getReceiverIds(
      conversationId,
      userId
    );

    await Promise.all(
      receiversId.map((receiverId) =>
        this.eventQueueService.emitWithQueue({
          userId: receiverId,
          event: 'make-group-premium',
          data: { conversationId },
          isDirect: true,
        })
      )
    );
  }

  async updateSubscription(
    userId: string,
    {
      isSubscribed,
      subscriptionPlan,
      subscriptionStart,
      subscriptionEnd,
    }: SubscriptionDetailsType
  ): Promise<void> {
    await this.userWriteRepo.updateSubscriptionDetails(
      userId,
      isSubscribed,
      subscriptionPlan,
      subscriptionStart,
      subscriptionEnd
    );

    // emit same user
    await this.eventQueueService.emitWithQueue({
      userId: userId,
      event: 'update-subscription-details',
      data: {
        isSubscribed,
        subscriptionPlan,
        subscriptionStart,
        subscriptionEnd,
      },
      isDirect: true,
    });

    // emit friends
    const userChatList = await this.conReadRepo.findDMsIds(userId);

    void Promise.all(
      userChatList.map((id) =>
        this.eventQueueService.emitWithQueue({
          userId: id,
          event: 'update-user-premium-status',
          data: {
            isSubscribed,
            userId,
          },
          isDirect: true,
        })
      )
    );
  }
}
