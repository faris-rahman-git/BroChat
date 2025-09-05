export interface IWebCallUserUseCase {
  execute(userToCall: string, from: string, signal: any): Promise<boolean>;
}
