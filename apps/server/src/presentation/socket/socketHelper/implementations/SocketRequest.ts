import { ISocketRequest } from '../ISocketRequest';

export class SocketRequest implements ISocketRequest {
  socketId?: unknown;
  user?: unknown;
  body?: unknown;

  constructor(init?: SocketRequest) {
    Object.assign(this, init);
  }
}
