import { IController } from '../../../../../app/providers/controller/IController';
import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';

import { CustomPayloadType } from '../../../../../domain/entity/auth/authTypes';
import { ISearchUserUseCase } from '../../../../../app/useCases/user/dms/interfaces/ISearchUserUseCase';
import { searchSchema } from '@bro/shared';

export class SearchUserController implements IController {
  constructor(
    private searchUserUseCase: ISearchUserUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const parsed = searchSchema.safeParse(httpRequest.body);

      if (!parsed.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, parsed.error.format());
      }

      const { id: userId } = httpRequest.user as CustomPayloadType;
      const { searchData } = parsed.data;

      response = await this.searchUserUseCase.execute(searchData, userId);

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in SearchUserController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
