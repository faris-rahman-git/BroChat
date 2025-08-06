import { IHttpRequest } from '../IHttpRequest';

export class HttpRequest implements IHttpRequest {
  header?: unknown;

  body?: unknown;

  query?: unknown;

  path?: unknown;

  cookies?: unknown;

  user?: unknown;

  constructor(init?: HttpRequest) {
    Object.assign(this, init);
  }
}
