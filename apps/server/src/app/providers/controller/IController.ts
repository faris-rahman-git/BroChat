import { IHttpResponse } from '../../../presentation/http/helpers/IHttpResponse';
import { HttpRequest } from '../../../presentation/http/helpers/implementations/HttpRequest';

export interface IController {
  handle(httpRequest: HttpRequest): Promise<IHttpResponse>;
}
