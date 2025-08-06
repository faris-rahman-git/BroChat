import { IClearQueueService } from '../../../app/providers/socket/IClearQueueService';
import { IOfflineQueueRepo } from '../../../app/repositories/redis/IOfflineQueueRepo';

export class ClearQueueService implements IClearQueueService {
  constructor(private offlineQueueRepo: IOfflineQueueRepo) {}

  async clearInvalidQueueItems(userId: string): Promise<void> {
    const length = await this.offlineQueueRepo.getQueueLength(userId);
    if (length === 0) return;
    for (let i = 0; i < length; i++) {
      let rawItem = await this.offlineQueueRepo.removeFirstEvent(userId);

      if (!rawItem) break;

      const { event, data } = rawItem;

      if (
        event !== 'force-logout' &&
        event !== 'user-offline' &&
        event !== 'user-online' &&
        event !== 'new-user-chat' &&
        event !== 'new-group-chat' &&
        event !== 'delete-message' &&
        event !== 'edit-message-update' &&
        event !== 'remove-group-chat' &&
        event !== 'remove-group-member' &&
        event !== 'make-group-admin' &&
        event !== 'dismiss-group-admin' &&
        event !== 'add-group-members' &&
        event !== 'update-group-info' &&
        event !== 'block-user-update' &&
        event !== 'make-group-premium' &&
        event !== 'update-subscription-details' &&
        event !== 'update-user-premium-status' &&
        event !== 'group-soft-delete' &&
        event !== 'group-block-update'
      ) {
        await this.offlineQueueRepo.addEventToQueue(userId, event, data);
      }
    }
  }
}
