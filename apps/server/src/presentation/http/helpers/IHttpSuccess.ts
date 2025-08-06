import { IHttpResponse } from './IHttpResponse';

export interface IHttpSuccess {
  success_200(data?: any): IHttpResponse;
}
