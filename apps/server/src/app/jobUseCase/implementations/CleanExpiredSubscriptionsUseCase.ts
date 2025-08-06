import { ISubscriptionCleanupService } from '../../providers/jobs/ISubscriptionCleanupService';
import { ICleanExpiredSubscriptionsUseCase } from '../interfaces/ICleanExpiredSubscriptionsUseCase';

export class CleanExpiredSubscriptionsUseCase
  implements ICleanExpiredSubscriptionsUseCase
{
  constructor(
    private subscriptionCleanupService: ISubscriptionCleanupService
  ) {}

  async execute(): Promise<number> {
    try {
      const count =
        await this.subscriptionCleanupService.cleanExpiredSubscriptions();

      return count;
    } catch (err: any) {
      console.log('Error in ForgotPasswordUseCase: ', err.message);
      return 0;
    }
  }
}
