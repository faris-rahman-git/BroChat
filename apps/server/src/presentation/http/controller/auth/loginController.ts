import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { loginSchema, LoginSchemaType } from '@bro/shared';
import { ILoginUseCase } from '../../../../app/useCases/auth/interfaces/ILoginUseCase';
import { IController } from '../../../../app/providers/controller/IController';

export class loginController implements IController {
  constructor(
    private loginUseCase: ILoginUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const parsed = loginSchema.safeParse(httpRequest.body);

      if (!parsed.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, parsed.error.format());
      }

      const data = parsed.data as LoginSchemaType;

      response = await this.loginUseCase.execute(data);

      if (!response.success) {
        if (response.statusCode === 404) {
          error = this.httpErrors.error_404();
        } else if (response.statusCode === 403) {
          error = this.httpErrors.error_403();
        } else {
          error = this.httpErrors.error_400();
        }
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
              sameSite: 'none',
              maxAge: 15 * 60 * 1000,
            },
          },
          {
            name: 'refreshToken',
            value: response.cookies?.refreshToken as string,
            options: {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            },
          },
      ]);
    } catch (err) {
      console.error('Error in loginController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
