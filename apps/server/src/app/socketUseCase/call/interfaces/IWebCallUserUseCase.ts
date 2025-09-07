import Peer from 'simple-peer';
export interface IWebCallUserUseCase {
  execute(userToCall: string, from: string, signal: Peer.SignalData): Promise<boolean>;
}
