export interface IWebAcceptCallUseCase {
  execute(signal: any, to: string, answerId: string): Promise<boolean>;
}
