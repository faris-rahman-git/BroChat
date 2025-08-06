import { ClearCookieDTO, CookieDTO } from '../../../app/dtos/CookieDTO';

export interface IHttpResponse {
  statusCode: number;

  body: Record<string, string>;

  cookies?: CookieDTO[];

  clearCookies?: ClearCookieDTO[];

  redirectUrl?: string
}
