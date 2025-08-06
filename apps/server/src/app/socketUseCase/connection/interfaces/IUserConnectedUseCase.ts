export interface IUserConnectedUseCase {
  execute(socketId: string, userId: string): Promise<boolean>;
}
