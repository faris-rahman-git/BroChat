import { IController } from '../../../../../app/providers/controller/IController';
import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';
import { planSchema, PlanSchemaType } from '@bro/shared';
import { IEditExclusivePlanUseCase } from '../../../../../app/useCases/user/plan/interfaces/IEditExclusivePlanUseCase';
import { CustomPayloadType } from '../../../../../domain/entity/auth/authTypes';

export class editExclusivePlanController implements IController {
  constructor(
    private editExclusivePlanUseCase: IEditExclusivePlanUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const parsed = planSchema.safeParse(httpRequest.body);

      if (!parsed.success) {
        error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, parsed.error.format());
      }
      const data = parsed.data as PlanSchemaType;
      const { id: userId } = httpRequest.user as CustomPayloadType;

      const { exclusivePlanId } = httpRequest.path as {
        exclusivePlanId: string;
      };

      response = await this.editExclusivePlanUseCase.execute(
        data,
        exclusivePlanId,
        userId
      );

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in editExclusivePlanController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
