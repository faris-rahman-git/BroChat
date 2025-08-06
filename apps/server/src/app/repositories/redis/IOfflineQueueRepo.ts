export interface IOfflineQueueRepo {
  getQueueLength(userId: string): Promise<number>;
  addEventToQueue(userId: string, event: string, data: any): Promise<void>;
  removeFirstEvent(userId: string): Promise<any>;
  getAllQueuedEvents(userId: string): Promise<any[]>;
  overwriteQueue(userId: string, events: any[]): Promise<void>;
}
