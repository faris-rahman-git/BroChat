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
import { IGetAllTransactionsUseCase } from '../../../../../app/useCases/user/profile/interfaces/IGetAllTransactionsUseCase';

export class getAllTransactionsController implements IController {
  constructor(
    private getAllTransactionsUseCase: IGetAllTransactionsUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { id: userId } = httpRequest.user as CustomPayloadType;

      response = await this.getAllTransactionsUseCase.execute(userId);

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in getAllTransactionsController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
