import { IController } from '../../../../app/providers/controller/IController';
import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';
import { IRegisterUserUseCase } from '../../../../app/useCases/auth/interfaces/IRegisterUserUseCase';
import { registerSchema } from '@bro/shared';
import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export class registerController implements IController {
  constructor(
    private registerUserUseCase: IRegisterUserUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const parsed = registerSchema.safeParse(httpRequest.body);

      if (!parsed.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, parsed.error.format());
      }

      const { email } = parsed.data;

      response = await this.registerUserUseCase.execute(email);

      if (!response.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, response.data);
      }

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in RegisterController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
