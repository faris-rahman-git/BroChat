import { IHttpResponse } from '../IHttpResponse';
import { ClearCookieDTO, CookieDTO } from '../../../../app/dtos/CookieDTO';

export class HttpResponse implements IHttpResponse {
  statusCode: number;

  body: Record<string, string>;

  cookies?: CookieDTO[];

  clearCookies?: ClearCookieDTO[];

  redirectUrl?: string;

  constructor(
    statusCode: number,
    body: any,
    cookies?: CookieDTO[],
    clearCookies?: ClearCookieDTO[],
    redirectUrl?: string
  ) {
    this.statusCode = statusCode;
    this.body = body;
    this.cookies = cookies;
    this.clearCookies = clearCookies;
    this.redirectUrl = redirectUrl;
  }
}
