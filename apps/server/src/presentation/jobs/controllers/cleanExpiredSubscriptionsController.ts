import { ICleanExpiredSubscriptionsUseCase } from '../../../app/jobUseCase/interfaces/ICleanExpiredSubscriptionsUseCase';
import { IJobController } from '../../../app/providers/controller/IJobController';

export class cleanExpiredSubscriptionsController implements IJobController {
  constructor(
    private cleanExpiredSubscriptionsUseCase: ICleanExpiredSubscriptionsUseCase
  ) {}

  async handle(): Promise<void> {
    try {
      const count = await this.cleanExpiredSubscriptionsUseCase.execute();
      console.log(
        `[Subscription Job] Cleaned up ${count} expired subscriptions.`
      );
    } catch (err) {
      console.error('Error in cleanExpiredSubscriptionsController:', err);
    }
  }
}
