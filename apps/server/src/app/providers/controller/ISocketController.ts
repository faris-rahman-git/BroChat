import { ISocketRequest } from '../../../presentation/socket/socketHelper/ISocketRequest';

export interface ISocketController {
  handle(socketRequest: ISocketRequest): Promise<boolean>;
}
