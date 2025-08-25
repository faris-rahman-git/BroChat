import { IController } from '../../../../../app/providers/controller/IController';
import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';

import { CustomPayloadType } from '../../../../../domain/dtos/auth/authTypes';
import { IDeleteMessageUseCase } from '../../../../../app/useCases/user/message/interfaces/IDeleteMessageUseCase';
import { DeleteMessageType } from '@bro/shared';

export class deleteMessageController implements IController {
  constructor(
    private deleteMessageUseCase: IDeleteMessageUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { id: userId } = httpRequest.user as CustomPayloadType;
      const { conversationId } = httpRequest.path as {
        conversationId: string;
      };
      const { type, messageIds } = httpRequest.body as {
        type: DeleteMessageType;
        messageIds: string[];
      };

      response = await this.deleteMessageUseCase.execute(
        messageIds,
        conversationId,
        userId,
        type
      );

      if (!response.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, response.data);
      }

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in deleteMessageController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
