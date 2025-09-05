import { ISubscriptionCleanupService } from '../../providers/jobs/ISubscriptionCleanupService';
import { IEventQueueService } from '../../providers/socket/IEventQueueService';
import { ICleanExpiredSubscriptionsUseCase } from '../interfaces/ICleanExpiredSubscriptionsUseCase';

export class CleanExpiredSubscriptionsUseCase
  implements ICleanExpiredSubscriptionsUseCase
{
  constructor(
    private subscriptionCleanupService: ISubscriptionCleanupService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(): Promise<number> {
    try {
      const expiredUsersId =
        await this.subscriptionCleanupService.cleanExpiredSubscriptions();

      void Promise.all(
        expiredUsersId.map((id) =>
          this.eventQueueService.emitWithQueue({
            userId: id,
            event: 'subscription-expired-notification',
            data: null,
            isDirect: true,
          })
        )
      );

      return expiredUsersId.length;
    } catch (err: any) {
      console.log('Error in CleanExpiredSubscriptionsUseCase: ', err);
      return 0;
    }
  }
}
