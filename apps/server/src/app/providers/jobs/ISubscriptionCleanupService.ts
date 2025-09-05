export interface ISubscriptionCleanupService {
  cleanExpiredSubscriptions(): Promise<string[]>;
}
