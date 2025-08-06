import { IController } from '../../../../app/providers/controller/IController';
import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { ISocialRegisterOrLoginUseCase } from '../../../../app/useCases/auth/interfaces/ISocialRegisterOrLoginUseCase';
import { AuthMessages } from '../../../../domain/enums/auth/AuthMessages';

export class socialRegisterOrLoginController implements IController {
  constructor(
    private socialRegisterOrLoginUseCase: ISocialRegisterOrLoginUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { email, name } = httpRequest.user as {
        email: string;
        name: string;
      };

      if (!email || !name) {
        error = this.httpErrors.error_404();
        const redirectUrl = `${
          process.env.CLIENT_URL
        }/auth-error?message=${encodeURIComponent(
          AuthMessages.SomthingWentWrong
        )}`;
        return new HttpResponse(error.statusCode, '', [], [], redirectUrl);
      }

      response = await this.socialRegisterOrLoginUseCase.execute({
        email,
        name,
      });

      if (!response.success) {
        error = this.httpErrors.error_400();
        const redirectUrl = `${
          process.env.CLIENT_URL
        }/auth-error?message=${encodeURIComponent(
          response.data?.message || AuthMessages.SomthingWentWrong
        )}`;
        return new HttpResponse(error.statusCode, '', [], [], redirectUrl);
      }

      const success = this.httpSuccess.success_200(response.data);
      const redirectUrl =
        response.data.role === 'user'
          ? `${process.env.CLIENT_URL}/?user=${encodeURIComponent(
              JSON.stringify(response.data)
            )}`
          : `${
              process.env.CLIENT_URL
            }/admin/dashboard?user=${encodeURIComponent(
              JSON.stringify(response.data)
            )}`;

      return new HttpResponse(
        success.statusCode,
        '',
        [
          {
            name: 'accessToken',
            value: response.cookies?.accessToken as string,
            options: {
              httpOnly: true,
              secure: false,
              sameSite: 'lax',
              maxAge: 15 * 60 * 1000,
            },
          },
          {
            name: 'refreshToken',
            value: response.cookies?.refreshToken as string,
            options: {
              httpOnly: true,
              secure: false,
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            },
          },
        ],
        [],
        redirectUrl
      );
    } catch (err) {
      console.error('Error in socialRegisterOrLoginController:', error);
      const errorResponse = this.httpErrors.error_500();
      const redirectUrl = `${
        process.env.CLIENT_URL
      }/auth-error?message=${encodeURIComponent(
        AuthMessages.SomthingWentWrong
      )}`;
      return new HttpResponse(
        errorResponse.statusCode,
        '',
        [],
        [],
        redirectUrl
      );
    }
  }
}
