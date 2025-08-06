import { IController } from '../../../../app/providers/controller/IController';
import { IHttpErrors } from '../../helpers/IHttpErrors';
import { IHttpRequest } from '../../helpers/IHttpRequest';
import { IHttpResponse } from '../../helpers/IHttpResponse';
import { IHttpSuccess } from '../../helpers/IHttpSuccess';
import { HttpErrors } from '../../helpers/implementations/HttpErrors';
import { HttpResponse } from '../../helpers/implementations/HttpResponse';
import { HttpSuccess } from '../../helpers/implementations/HttpSuccess';
import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import { ResetPasswordType } from '../../../../app/dtos/auth';
import { IResetPasswordUseCase } from '../../../../app/useCases/auth/interfaces/IResetPasswordUseCase';
import { combinedOtpPasswordAndResetSchema } from '../../../schemas/combinedOtpPasswordAndResetSchema';

export class resetPasswordController implements IController {
  constructor(
    private resetPasswordUseCase: IResetPasswordUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const parsed = combinedOtpPasswordAndResetSchema.safeParse(
        httpRequest.body
      );

      if (!parsed.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, parsed.error.format());
      }

      const user = parsed.data as ResetPasswordType;

      response = await this.resetPasswordUseCase.execute(user);

      if (!response.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, response.data);
      }

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in otpAndPasswordController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
