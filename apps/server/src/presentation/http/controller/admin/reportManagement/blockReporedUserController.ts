import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';
import { IBlockReporedUserUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IBlockReporedUserUseCase';
import { IController } from '../../../../../app/providers/controller/IController';

export class blockReporedUserController implements IController {
  constructor(
    private blockReporedUserUseCase: IBlockReporedUserUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { reportId, reportedUserId, note } = httpRequest.body as {
        reportId: string;
        reportedUserId: string;
        note: string;
      };

      response = await this.blockReporedUserUseCase.execute(
        reportId,
        reportedUserId,
        note
      );

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in blockReporedUserController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
