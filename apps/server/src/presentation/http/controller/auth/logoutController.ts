import { IController } from '../../../../app/providers/controller/IController';
import { ILogoutUseCase } from '../../../../app/useCases/auth/interfaces/ILogoutUseCase';
import { CustomPayloadType } from '../../../../domain/entity/auth/authTypes';
import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';

export class logoutController implements IController {
  constructor(
    private logoutUseCase: ILogoutUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;

    try {
      const { id: userId } = httpRequest.user as CustomPayloadType;

      await this.logoutUseCase.execute(userId);
      const success = this.httpSuccess.success_200();

      return new HttpResponse(
        success.statusCode,
        {},
        [],
        [
          {
            name: 'accessToken',
            options: {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            },
          },
          {
            name: 'refreshToken',
            options: {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            },
          },
        ]
      );
    } catch (err) {
      console.error('Error in logoutController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
