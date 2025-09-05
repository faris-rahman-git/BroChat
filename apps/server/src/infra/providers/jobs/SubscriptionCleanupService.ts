import { ISubscriptionCleanupService } from '../../../app/providers/jobs/ISubscriptionCleanupService';
import { IEventQueueService } from '../../../app/providers/socket/IEventQueueService';
import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../app/repositories/user/IUserWriteRepo';

export class SubscriptionCleanupService implements ISubscriptionCleanupService {
  constructor(
    private userReadRepo: IUserReadRepo,
    private userWriteRepo: IUserWriteRepo,
    private eventQueueService: IEventQueueService
  ) {}

  private emitUpdateSupscriptionDetails(userId: string): void {
    void this.eventQueueService.emitWithQueue({
      userId,
      event: 'update-subscription-details',
      data: {
        isSubscribed: false,
        subscriptionPlan: null,
        subscriptionStart: null,
        subscriptionEnd: null,
      },
      isDirect: true,
    });
  }

  async cleanExpiredSubscriptions(): Promise<string[]> {
    const expiredUsersId =
      await this.userReadRepo.findExpiredSubscriptionsUserId();

    await Promise.all(
      expiredUsersId.map(async (id) => {
        await this.userWriteRepo.updateSubscriptionDetails(
          id,
          false,
          null,
          null,
          null
        );

        this.emitUpdateSupscriptionDetails(id);
      })
    );

    return expiredUsersId;
  }
}
