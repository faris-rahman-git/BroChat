import { IController } from '../../../../../app/providers/controller/IController';
import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';
import { IUserBlockManagementUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IUserBlockManagementUseCase';

export class userBlockManagementController implements IController {
  constructor(
    private userBlockManagementUseCase: IUserBlockManagementUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { userId, isBlocked, searchValue, status, joinedAt ,page } =
        httpRequest.body as {
          userId: string;
          isBlocked: boolean;
          searchValue: string;
          status: string;
          joinedAt: string;
          page : number
        };

      response = await this.userBlockManagementUseCase.execute(
        userId,
        isBlocked,
        searchValue,
        status,
        joinedAt,
        page
      );

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in userBlockManagementController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
