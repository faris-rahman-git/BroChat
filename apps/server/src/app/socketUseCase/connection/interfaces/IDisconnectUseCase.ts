export interface IDisconnectUseCase {
  execute(socketId: string): Promise<boolean>;
}
