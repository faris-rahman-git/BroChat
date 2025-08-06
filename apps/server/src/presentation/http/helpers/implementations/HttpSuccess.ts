import { IHttpResponse } from '../IHttpResponse';
import { IHttpSuccess } from '../IHttpSuccess';

export class HttpSuccess implements IHttpSuccess {
  success_200(data?: any): IHttpResponse {
    return {
      statusCode: 200,
      body: data,
    };
  }
}
