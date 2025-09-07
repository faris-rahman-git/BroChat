import Peer from 'simple-peer';
export interface IWebAcceptCallUseCase {
  execute(signal: Peer.SignalData, to: string, answerId: string): Promise<boolean>;
}
