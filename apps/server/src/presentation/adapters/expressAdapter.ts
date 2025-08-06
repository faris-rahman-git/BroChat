import { Request, Response } from 'express';

import { IHttpRequest } from '../http/helpers/IHttpRequest';
import { IHttpResponse } from '../http/helpers/IHttpResponse';
import { HttpRequest } from '../http/helpers/implementations/HttpRequest';
import { IController } from '../../app/providers/controller/IController';

export async function expressAdapter(
  request: Request,
  response: Response,
  apiRoute: IController
): Promise<void> {
  const httpRequest: IHttpRequest = new HttpRequest({
    header: request.header,
    body: request.body,
    path: request.params,
    query: request.query,
    cookies: request.cookies,
    user: request.user,
  });
  const result: IHttpResponse = await apiRoute.handle(httpRequest);

  if (result.cookies && result.cookies.length > 0) {
    result.cookies.forEach((cookie) => {
      response.cookie(cookie.name, cookie.value, cookie.options || {});
    });
  }

  if (result.clearCookies && result.clearCookies.length > 0) {
    result.clearCookies.forEach((cookie) => {
      response.clearCookie(cookie.name, cookie.options || {});
    });
  }

  if (result.redirectUrl) {
    response.redirect(result.redirectUrl);
    return;
  }

  response.status(result.statusCode).json(result.body);
  return;
}
