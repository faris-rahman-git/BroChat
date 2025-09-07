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
import { IMakeGroupAdminUseCase } from '../../../../../app/useCases/user/group/interfaces/IMakeGroupAdminUseCase';

export class makeGroupAdminController implements IController {
  constructor(
    private makeGroupAdminUseCase: IMakeGroupAdminUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { id: userId } = httpRequest.user as CustomPayloadType;
      const { conversationId, memberId } = httpRequest.path as {
        conversationId: string;
        memberId: string;
      };

      response = await this.makeGroupAdminUseCase.execute(
        conversationId,
        userId,
        memberId
      );

      if (!response.success) {
        if (response.statusCode === 403) {
          error = this.httpErrors.error_403();
        } else {
          error = this.httpErrors.error_400();
        }
        return new HttpResponse(error.statusCode, response.data);
      }

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in makeGroupAdminController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
