export interface IClearQueueService {
  clearInvalidQueueItems(userId: string): Promise<void>;
}
