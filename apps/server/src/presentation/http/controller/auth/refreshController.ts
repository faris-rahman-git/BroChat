import { IController } from '../../../../app/providers/controller/IController';
import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { IRefreshUseCase } from '../../../../app/useCases/auth/interfaces/IRefreshUseCase';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';

export class refreshController implements IController {
  constructor(
    private refreshUseCase: IRefreshUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { refreshToken } = httpRequest.cookies as { refreshToken: string };
      if (!refreshToken) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, {
          message: AuthMessages.RefrechTokenInvalid,
        });
      }

      response = await this.refreshUseCase.execute(refreshToken);

      if (!response.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, response.data);
      }

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body, [
        {
          name: 'accessToken',
          value: response.cookies?.accessToken as string,
          options: {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
          },
        },
        {
          name: 'refreshToken',
          value: response.cookies?.refreshToken as string,
          options: {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          },
        },
      ]);
    } catch (err) {
      console.error('Error in refreshController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
