export interface ISubscriptionCleanupService {
  cleanExpiredSubscriptions(): Promise<number>;
}
