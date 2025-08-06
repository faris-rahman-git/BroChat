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
import { IUpdateGroupInfoUseCase } from '../../../../../app/useCases/user/group/interfaces/IUpdateGroupInfoUseCase';
import { updateGroupInfoType } from '@bro/shared';

export class updateGroupInfoController implements IController {
  constructor(
    private updateGroupInfoUseCase: IUpdateGroupInfoUseCase,
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
      const { groupInfo } = httpRequest.body as {
        groupInfo: updateGroupInfoType;
      };

      response = await this.updateGroupInfoUseCase.execute(
        conversationId,
        userId,
        groupInfo
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
      console.error('Error in updateGroupInfoController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
