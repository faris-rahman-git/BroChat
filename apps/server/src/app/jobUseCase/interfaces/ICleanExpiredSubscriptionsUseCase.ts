export interface ICleanExpiredSubscriptionsUseCase {
  execute(): Promise<number>;
}
